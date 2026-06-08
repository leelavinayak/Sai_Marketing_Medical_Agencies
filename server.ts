import "dotenv/config";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import {
  initDatabase,
  AdminCredential,
  Setting,
  Category,
  Product,
  Customer,
  Inquiry,
  GalleryImage,
  Testimonial
} from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";
if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("Missing required production JWT_SECRET environment variable.");
}
const JWT_SECRET = process.env.JWT_SECRET || "sai_marketing_secure_jwt_secret_token_12216";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Admin Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token or session expired." });
  }
}

// ---------------------------------------------
// API ENDPOINTS
// ---------------------------------------------

// Active Health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Admin Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const admin = await AdminCredential.findOne({ username });
    if (!admin) {
      return res.status(400).json({ error: "Invalid admin credentials." });
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid admin credentials." });
    }

    const token = jwt.sign({ username: admin.username, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, username });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Admin Password
app.post("/api/auth/change-password", authenticateToken, async (req: any, res: any) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required." });
    }

    const admin = await AdminCredential.findOne({ username: req.user.username });
    if (!admin) {
      return res.status(400).json({ error: "Admin account not found." });
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CUSTOMER MOBILE AUTH API ----------------

// Customer Register
app.post("/api/auth/customer/register", async (req, res) => {
  try {
    const { name, phone, companyName, email, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: "Name, Phone number, and Password are required." });
    }

    const existingUser = await Customer.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "A user with this mobile number already exists." });
    }

    const newCustomer = await Customer.create({
      id: "cust_" + Date.now(),
      name,
      phone,
      password,
      companyName: companyName || "",
      email: email || "",
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, user: newCustomer, message: "Registered successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Login
app.post("/api/auth/customer/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Mobile number and password are required." });
    }

    const customers = await Customer.find();
    const customer = customers.find((c: any) => {
      const cleanInput = phone.replace(/[^\d+]/g, "");
      const cleanStored = c.phone.replace(/[^\d+]/g, "");
      return cleanStored.endsWith(cleanInput) || cleanInput.endsWith(cleanStored);
    });

    if (!customer) {
      return res.status(404).json({ error: "Mobile number not found. Please register as a new user." });
    }

    if (customer.password && customer.password !== password) {
      return res.status(401).json({ error: "Incorrect password for this mobile number." });
    }

    if (!customer.password) {
      customer.password = password;
      await customer.save();
    }

    res.json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        companyName: customer.companyName,
        email: customer.email,
        createdAt: customer.createdAt
      },
      message: "Logged in successfully!"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to retrieve all registered B2B clients
app.get("/api/admin/customers", authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to retrieve single customer with inquiry history
app.get("/api/admin/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ id });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const cleanInput = customer.phone.replace(/[^\d]/g, "");
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    const matchedInquiries = [];
    for (const inq of inquiries) {
      const cleanInqPhone = inq.phone.replace(/[^\d]/g, "");
      if (cleanInqPhone.endsWith(cleanInput) || cleanInput.endsWith(cleanInqPhone)) {
        matchedInquiries.push(inq);
      }
    }

    res.json({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      companyName: customer.companyName,
      email: customer.email,
      createdAt: customer.createdAt,
      inquiries: matchedInquiries
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to delete customer
app.delete("/api/admin/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Customer.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.json({ success: true, message: "Customer deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve callback inquiries for a specific customer by normalizing their phone coordinates
app.get("/api/customer-inquiries/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const cleanInput = phone.replace(/[^\d]/g, "");
    if (!cleanInput) {
      return res.json([]);
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    const matchedInquiries = [];
    for (const inq of inquiries) {
      const cleanInqPhone = inq.phone.replace(/[^\d]/g, "");
      if (cleanInqPhone.endsWith(cleanInput) || cleanInput.endsWith(cleanInqPhone)) {
        matchedInquiries.push(inq);
      }
    }

    res.json(matchedInquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CATEGORIES API ----------------

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/categories", authenticateToken, async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required." });
    }

    const newCategory = await Category.create({
      id: "cat_" + Date.now(),
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
      description: description || "",
      image: image || "https://picsum.photos/seed/cat/600/400"
    });

    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/categories/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;

    const cat = await Category.findOne({ id });
    if (!cat) {
      return res.status(404).json({ error: "Category not found." });
    }

    if (name !== undefined) cat.name = name;
    if (slug !== undefined) cat.slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    if (description !== undefined) cat.description = description;
    if (image !== undefined) cat.image = image;

    await cat.save();

    res.json(cat);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.json({ success: true, message: "Category deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- PRODUCTS API ----------------

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", authenticateToken, async (req, res) => {
  try {
    const { name, category, description, image, price, inStock, isFeatured, packSize, manufacturer, chemicalFormula } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Name and Category are required." });
    }

    const newProduct = await Product.create({
      id: "prod_" + Date.now(),
      name,
      category,
      description: description || "",
      image: image || "https://picsum.photos/seed/product/600/400",
      price: price || "Wholesale Pricing",
      inStock: inStock !== undefined ? !!inStock : true,
      isFeatured: isFeatured !== undefined ? !!isFeatured : false,
      packSize: packSize || "Bulk Size",
      manufacturer: manufacturer || "Sai distributor partner",
      chemicalFormula: chemicalFormula || null,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const prod = await Product.findOne({ id });
    if (!prod) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (body.name !== undefined) prod.name = body.name;
    if (body.category !== undefined) prod.category = body.category;
    if (body.description !== undefined) prod.description = body.description;
    if (body.image !== undefined) prod.image = body.image;
    if (body.price !== undefined) prod.price = body.price;
    if (body.inStock !== undefined) prod.inStock = !!body.inStock;
    if (body.isFeatured !== undefined) prod.isFeatured = !!body.isFeatured;
    if (body.packSize !== undefined) prod.packSize = body.packSize;
    if (body.manufacturer !== undefined) prod.manufacturer = body.manufacturer;
    if (body.chemicalFormula !== undefined) prod.chemicalFormula = body.chemicalFormula;

    await prod.save();

    res.json(prod);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ success: true, message: "Product deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- INQUIRIES API ----------------

app.get("/api/inquiries", authenticateToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, phone, email, companyName, message, products } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Name, phone number, and message are required." });
    }

    const newInquiry = await Inquiry.create({
      id: "inq_" + Date.now(),
      name,
      phone,
      email: email || "",
      companyName: companyName || "",
      message,
      status: "pending",
      products: Array.isArray(products) ? products.map((p: any) => ({
        productId: p.productId,
        productName: p.productName,
        quantity: p.quantity
      })) : [],
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      inquiry: newInquiry,
      message: "Thank you! Your bulk order inquiry has been received. Our team will contact you shortly."
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/inquiries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, products, adminNotes, callingConfirmed } = req.body;

    if (!status || !["pending", "reviewed", "completed", "delivered", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required." });
    }

    const inq = await Inquiry.findOne({ id });
    if (!inq) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    inq.status = status;
    if (adminNotes !== undefined) inq.adminNotes = adminNotes;
    if (callingConfirmed !== undefined) inq.callingConfirmed = !!callingConfirmed;
    if (products !== undefined) {
      inq.products = Array.isArray(products) ? products.map((p: any) => ({
        productId: p.productId,
        productName: p.productName,
        quantity: p.quantity
      })) : [];
    }

    await inq.save();

    res.json(inq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/inquiries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Inquiry.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    res.json({ success: true, message: "Inquiry deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- GALLERY API ----------------

app.get("/api/gallery", async (req, res) => {
  try {
    const gallery = await GalleryImage.find();
    res.json(gallery);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gallery", authenticateToken, async (req, res) => {
  try {
    const { url, title, category } = req.body;
    if (!url || !title) {
      return res.status(400).json({ error: "Image URL and title are required." });
    }

    const newImage = await GalleryImage.create({
      id: "gal_" + Date.now(),
      url,
      title,
      category: category || "Warehouse",
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newImage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/gallery/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await GalleryImage.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Gallery image not found." });
    }

    res.json({ success: true, message: "Gallery image deleted." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- TESTIMONIALS API ----------------

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/testimonials", authenticateToken, async (req, res) => {
  try {
    const { name, role, company, feedback, rating } = req.body;
    if (!name || !feedback) {
      return res.status(400).json({ error: "Name and feedback require content." });
    }

    const newTestimonial = await Testimonial.create({
      id: "test_" + Date.now(),
      name,
      role: role || "Partner",
      company: company || "Retailer",
      feedback,
      rating: Number(rating) || 5,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newTestimonial);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const test = await Testimonial.findOne({ id });
    if (!test) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    if (body.name !== undefined) test.name = body.name;
    if (body.role !== undefined) test.role = body.role;
    if (body.company !== undefined) test.company = body.company;
    if (body.feedback !== undefined) test.feedback = body.feedback;
    if (body.rating !== undefined) test.rating = Number(body.rating);

    await test.save();

    res.json(test);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Testimonial.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    res.json({ success: true, message: "Testimonial removed." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- SETTINGS API ----------------

app.get("/api/settings", async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.json(setting || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings", authenticateToken, async (req, res) => {
  try {
    const body = req.body;
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    if (body.companyName !== undefined) setting.companyName = body.companyName;
    if (body.ownerName !== undefined) setting.ownerName = body.ownerName;
    if (body.phone !== undefined) setting.phone = body.phone;
    if (body.email !== undefined) setting.email = body.email;
    if (body.address !== undefined) setting.address = body.address;
    if (body.whatsappNumber !== undefined) setting.whatsappNumber = body.whatsappNumber;
    if (body.facebookUrl !== undefined) setting.facebookUrl = body.facebookUrl;
    if (body.twitterUrl !== undefined) setting.twitterUrl = body.twitterUrl;
    if (body.linkedinUrl !== undefined) setting.linkedinUrl = body.linkedinUrl;
    if (body.officeHours !== undefined) setting.officeHours = body.officeHours;
    if (body.announcement !== undefined) setting.announcement = body.announcement;

    await setting.save();

    res.json(setting);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- DASHBOARD STATS API ----------------

app.get("/api/stats", authenticateToken, async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalInquiries,
      totalGalleryImages,
      pendingInquiries,
      totalCustomers,
      orderCount,
      delCount,
      totalTestimonials
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Inquiry.countDocuments(),
      GalleryImage.countDocuments(),
      Inquiry.countDocuments({ status: "pending" }),
      Customer.countDocuments(),
      Inquiry.countDocuments({ status: { $in: ["reviewed", "completed", "delivered"] } }),
      Inquiry.countDocuments({ status: { $in: ["completed", "delivered"] } }),
      Testimonial.countDocuments()
    ]);

    res.json({
      totalProducts,
      totalCategories,
      totalInquiries,
      totalGalleryImages,
      pendingInquiries,
      totalCustomers,
      totalOrders: orderCount,
      pendingOrders: pendingInquiries,
      deliveredOrders: delCount,
      totalTestimonials
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE & BOOT
// ---------------------------------------------

async function startServer() {
  try {
    await initDatabase();
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational at: http://localhost:${PORT}`);
  });
}

startServer();
