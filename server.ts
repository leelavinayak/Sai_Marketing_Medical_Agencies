import "dotenv/config";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { pool, initDatabase } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
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

    const [rows] = await pool.query<any[]>("SELECT * FROM admin_credentials WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid admin credentials." });
    }

    const isMatch = bcrypt.compareSync(password, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid admin credentials." });
    }

    const token = jwt.sign({ username: rows[0].username, role: "admin" }, JWT_SECRET, {
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

    const [rows] = await pool.query<any[]>("SELECT * FROM admin_credentials WHERE username = ?", [req.user.username]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Admin account not found." });
    }

    const isMatch = bcrypt.compareSync(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);
    await pool.query("UPDATE admin_credentials SET password_hash = ? WHERE username = ?", [passwordHash, req.user.username]);

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

    const [existingUser] = await pool.query<any[]>("SELECT * FROM customers WHERE phone = ?", [phone]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "A user with this mobile number already exists." });
    }

    const newCustomer = {
      id: "cust_" + Date.now(),
      name,
      phone,
      password,
      companyName: companyName || "",
      email: email || "",
      createdAt: new Date().toISOString()
    };

    await pool.query(
      "INSERT INTO customers (id, name, phone, password, company_name, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newCustomer.id, newCustomer.name, newCustomer.phone, newCustomer.password, newCustomer.companyName, newCustomer.email, newCustomer.createdAt]
    );

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

    const [rows] = await pool.query<any[]>("SELECT * FROM customers");
    const customer = rows.find((c: any) => {
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
      await pool.query("UPDATE customers SET password = ? WHERE id = ?", [password, customer.id]);
      customer.password = password;
    }

    res.json({ success: true, user: { id: customer.id, name: customer.name, phone: customer.phone, companyName: customer.company_name, email: customer.email, createdAt: customer.created_at }, message: "Logged in successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to retrieve all registered B2B clients
app.get("/api/admin/customers", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query<any[]>("SELECT id, name, phone, company_name as companyName, email, created_at as createdAt FROM customers ORDER BY created_at DESC");
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to retrieve single customer with inquiry history
app.get("/api/admin/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [custRows] = await pool.query<any[]>("SELECT id, name, phone, company_name as companyName, email, created_at as createdAt FROM customers WHERE id = ?", [id]);
    if (custRows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    const customer = custRows[0];

    const cleanInput = customer.phone.replace(/[^\d]/g, "");
    const [inqRows] = await pool.query<any[]>("SELECT id, name, phone, email, company_name as companyName, message, status, admin_notes as adminNotes, calling_confirmed as callingConfirmed, created_at as createdAt FROM inquiries ORDER BY created_at DESC");

    const matchedInquiries = [];
    for (const inq of inqRows) {
      const cleanInqPhone = inq.phone.replace(/[^\d]/g, "");
      if (cleanInqPhone.endsWith(cleanInput) || cleanInput.endsWith(cleanInqPhone)) {
        const [prodRows] = await pool.query<any[]>("SELECT product_id as productId, product_name as productName, quantity FROM inquiry_products WHERE inquiry_id = ?", [inq.id]);
        matchedInquiries.push({
          ...inq,
          callingConfirmed: !!inq.callingConfirmed,
          products: prodRows
        });
      }
    }

    res.json({ ...customer, inquiries: matchedInquiries });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to delete customer
app.delete("/api/admin/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM customers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
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

    const [inqRows] = await pool.query<any[]>("SELECT id, name, phone, email, company_name as companyName, message, status, admin_notes as adminNotes, calling_confirmed as callingConfirmed, created_at as createdAt FROM inquiries ORDER BY created_at DESC");

    const matchedInquiries = [];
    for (const inq of inqRows) {
      const cleanInqPhone = inq.phone.replace(/[^\d]/g, "");
      if (cleanInqPhone.endsWith(cleanInput) || cleanInput.endsWith(cleanInqPhone)) {
        const [prodRows] = await pool.query<any[]>("SELECT product_id as productId, product_name as productName, quantity FROM inquiry_products WHERE inquiry_id = ?", [inq.id]);
        matchedInquiries.push({
          ...inq,
          callingConfirmed: !!inq.callingConfirmed,
          products: prodRows
        });
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
    const [rows] = await pool.query("SELECT id, name, slug, description, image FROM categories");
    res.json(rows);
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

    const newCategory = {
      id: "cat_" + Date.now(),
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
      description: description || "",
      image: image || "https://picsum.photos/seed/cat/600/400"
    };

    await pool.query("INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)", [
      newCategory.id,
      newCategory.name,
      newCategory.slug,
      newCategory.description,
      newCategory.image
    ]);

    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/categories/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;

    const [rows] = await pool.query<any[]>("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    const updated = {
      name: name || rows[0].name,
      slug: slug ? slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-") : rows[0].slug,
      description: description !== undefined ? description : rows[0].description,
      image: image || rows[0].image
    };

    await pool.query("UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?", [
      updated.name,
      updated.slug,
      updated.description,
      updated.image,
      id
    ]);

    res.json({ id, ...updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM categories WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
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
    const [rows] = await pool.query<any[]>(
      "SELECT id, name, category, description, image, price, in_stock as inStock, is_featured as isFeatured, pack_size as packSize, manufacturer, chemical_formula as chemicalFormula, created_at as createdAt FROM products"
    );
    const formatted = rows.map(r => ({
      ...r,
      inStock: !!r.inStock,
      isFeatured: !!r.isFeatured
    }));
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", authenticateToken, async (req, res) => {
  try {
    const { name, category, description, image, price, inStock, isFeatured, packSize, manufacturer } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Name and Category are required." });
    }

    const newProduct = {
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
      createdAt: new Date().toISOString()
    };

    await pool.query(
      `INSERT INTO products (id, name, category, description, image, price, in_stock, is_featured, pack_size, manufacturer, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newProduct.id,
        newProduct.name,
        newProduct.category,
        newProduct.description,
        newProduct.image,
        newProduct.price,
        newProduct.inStock ? 1 : 0,
        newProduct.isFeatured ? 1 : 0,
        newProduct.packSize,
        newProduct.manufacturer,
        newProduct.createdAt
      ]
    );

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const [rows] = await pool.query<any[]>("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const updated = {
      name: body.name || rows[0].name,
      category: body.category || rows[0].category,
      description: body.description ?? rows[0].description,
      image: body.image || rows[0].image,
      price: body.price !== undefined ? body.price : rows[0].price,
      inStock: body.inStock !== undefined ? !!body.inStock : !!rows[0].in_stock,
      isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : !!rows[0].is_featured,
      packSize: body.packSize !== undefined ? body.packSize : rows[0].pack_size,
      manufacturer: body.manufacturer !== undefined ? body.manufacturer : rows[0].manufacturer,
    };

    await pool.query(
      `UPDATE products SET name = ?, category = ?, description = ?, image = ?, price = ?, in_stock = ?, is_featured = ?, pack_size = ?, manufacturer = ? WHERE id = ?`,
      [
        updated.name,
        updated.category,
        updated.description,
        updated.image,
        updated.price,
        updated.inStock ? 1 : 0,
        updated.isFeatured ? 1 : 0,
        updated.packSize,
        updated.manufacturer,
        id
      ]
    );

    res.json({ id, ...updated, inStock: updated.inStock, isFeatured: updated.isFeatured });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
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
    const [inqRows] = await pool.query<any[]>(
      "SELECT id, name, phone, email, company_name as companyName, message, status, admin_notes as adminNotes, calling_confirmed as callingConfirmed, created_at as createdAt FROM inquiries ORDER BY created_at DESC"
    );
    const result = [];
    for (const inq of inqRows) {
      const [prodRows] = await pool.query<any[]>("SELECT product_id as productId, product_name as productName, quantity FROM inquiry_products WHERE inquiry_id = ?", [inq.id]);
      result.push({
        ...inq,
        callingConfirmed: !!inq.callingConfirmed,
        products: prodRows
      });
    }
    res.json(result);
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

    const newInquiry = {
      id: "inq_" + Date.now(),
      name,
      phone,
      email: email || "",
      companyName: companyName || "",
      message,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    await pool.query(
      `INSERT INTO inquiries (id, name, phone, email, company_name, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newInquiry.id,
        newInquiry.name,
        newInquiry.phone,
        newInquiry.email,
        newInquiry.companyName,
        newInquiry.message,
        newInquiry.status,
        newInquiry.createdAt
      ]
    );

    const prodList = Array.isArray(products) ? products : [];
    for (const item of prodList) {
      await pool.query(
        "INSERT INTO inquiry_products (inquiry_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)",
        [newInquiry.id, item.productId, item.productName, item.quantity]
      );
    }

    res.status(201).json({ success: true, inquiry: { ...newInquiry, products: prodList }, message: "Thank you! Your bulk order inquiry has been received. Our team will contact you shortly." });
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

    const [rows] = await pool.query<any[]>("SELECT * FROM inquiries WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    let updateQuery = "UPDATE inquiries SET status = ?";
    const queryParams: any[] = [status];
    if (adminNotes !== undefined) {
      updateQuery += ", admin_notes = ?";
      queryParams.push(adminNotes);
    }
    if (callingConfirmed !== undefined) {
      updateQuery += ", calling_confirmed = ?";
      queryParams.push(callingConfirmed ? 1 : 0);
    }
    updateQuery += " WHERE id = ?";
    queryParams.push(id);

    await pool.query(updateQuery, queryParams);

    if (products !== undefined) {
      await pool.query("DELETE FROM inquiry_products WHERE inquiry_id = ?", [id]);
      const prodList = Array.isArray(products) ? products : [];
      for (const item of prodList) {
        await pool.query(
          "INSERT INTO inquiry_products (inquiry_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)",
          [id, item.productId, item.productName, item.quantity]
        );
      }
    }

    const [updatedInqRows] = await pool.query<any[]>("SELECT id, name, phone, email, company_name as companyName, message, status, admin_notes as adminNotes, calling_confirmed as callingConfirmed, created_at as createdAt FROM inquiries WHERE id = ?", [id]);
    const [updatedProdRows] = await pool.query<any[]>("SELECT product_id as productId, product_name as productName, quantity FROM inquiry_products WHERE inquiry_id = ?", [id]);

    res.json({
      ...updatedInqRows[0],
      callingConfirmed: !!updatedInqRows[0].callingConfirmed,
      products: updatedProdRows
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/inquiries/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM inquiries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
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
    const [rows] = await pool.query<any[]>("SELECT id, url, title, category, created_at as createdAt FROM gallery");
    res.json(rows);
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

    const newImage = {
      id: "gal_" + Date.now(),
      url,
      title,
      category: category || "Warehouse",
      createdAt: new Date().toISOString()
    };

    await pool.query("INSERT INTO gallery (id, url, title, category, created_at) VALUES (?, ?, ?, ?, ?)", [
      newImage.id,
      newImage.url,
      newImage.title,
      newImage.category,
      newImage.createdAt
    ]);

    res.status(201).json(newImage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/gallery/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM gallery WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
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
    const [rows] = await pool.query<any[]>("SELECT id, name, role, company, feedback, rating, created_at as createdAt FROM testimonials");
    res.json(rows);
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

    const newTestimonial = {
      id: "test_" + Date.now(),
      name,
      role: role || "Partner",
      company: company || "Retailer",
      feedback,
      rating: Number(rating) || 5,
      createdAt: new Date().toISOString()
    };

    await pool.query("INSERT INTO testimonials (id, name, role, company, feedback, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      newTestimonial.id,
      newTestimonial.name,
      newTestimonial.role,
      newTestimonial.company,
      newTestimonial.feedback,
      newTestimonial.rating,
      newTestimonial.createdAt
    ]);

    res.status(201).json(newTestimonial);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const [rows] = await pool.query<any[]>("SELECT * FROM testimonials WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Testimonial not found." });
    }

    const updated = {
      name: body.name || rows[0].name,
      role: body.role || rows[0].role,
      company: body.company || rows[0].company,
      feedback: body.feedback || rows[0].feedback,
      rating: body.rating !== undefined ? Number(body.rating) : rows[0].rating
    };

    await pool.query("UPDATE testimonials SET name = ?, role = ?, company = ?, feedback = ?, rating = ? WHERE id = ?", [
      updated.name,
      updated.role,
      updated.company,
      updated.feedback,
      updated.rating,
      id
    ]);

    res.json({ id, ...updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/testimonials/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<any>("DELETE FROM testimonials WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
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
    const [rows] = await pool.query<any[]>("SELECT company_name as companyName, owner_name as ownerName, phone, email, address, whatsapp_number as whatsappNumber, facebook_url as facebookUrl, twitter_url as twitterUrl, linkedin_url as linkedinUrl, office_hours as officeHours, announcement FROM settings WHERE id = 1");
    res.json(rows[0] || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings", authenticateToken, async (req, res) => {
  try {
    const body = req.body;
    const [rows] = await pool.query<any[]>("SELECT * FROM settings WHERE id = 1");
    const current = rows[0] || {};

    const updated = {
      companyName: body.companyName || current.company_name,
      ownerName: body.ownerName || current.owner_name,
      phone: body.phone || current.phone,
      email: body.email || current.email,
      address: body.address || current.address,
      whatsappNumber: body.whatsappNumber || current.whatsapp_number,
      facebookUrl: body.facebookUrl ?? current.facebook_url,
      twitterUrl: body.twitterUrl ?? current.twitter_url,
      linkedinUrl: body.linkedinUrl ?? current.linkedin_url,
      officeHours: body.officeHours || current.office_hours,
      announcement: body.announcement ?? current.announcement
    };

    await pool.query(
      `UPDATE settings SET company_name = ?, owner_name = ?, phone = ?, email = ?, address = ?, whatsapp_number = ?, facebook_url = ?, twitter_url = ?, linkedin_url = ?, office_hours = ?, announcement = ? WHERE id = 1`,
      [
        updated.companyName,
        updated.ownerName,
        updated.phone,
        updated.email,
        updated.address,
        updated.whatsappNumber,
        updated.facebookUrl,
        updated.twitterUrl,
        updated.linkedinUrl,
        updated.officeHours,
        updated.announcement
      ]
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- DASHBOARD STATS API ----------------

app.get("/api/stats", authenticateToken, async (req, res) => {
  try {
    const [prodRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM products");
    const [catRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM categories");
    const [inqRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM inquiries");
    const [galRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM gallery");
    const [pendingRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM inquiries WHERE status = 'pending'");
    const [custRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM customers");
    const [orderRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM inquiries WHERE status IN ('reviewed', 'completed', 'delivered')");
    const [delRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM inquiries WHERE status IN ('completed', 'delivered')");
    const [testRows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM testimonials");

    res.json({
      totalProducts: prodRows[0].count,
      totalCategories: catRows[0].count,
      totalInquiries: inqRows[0].count,
      totalGalleryImages: galRows[0].count,
      pendingInquiries: pendingRows[0].count,
      totalCustomers: custRows[0].count,
      totalOrders: orderRows[0].count,
      pendingOrders: pendingRows[0].count,
      deliveredOrders: delRows[0].count,
      totalTestimonials: testRows[0].count
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
