import mongoose, { Schema } from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI = process.env.MONGODB_URI;

if (isProduction && !MONGODB_URI) {
  throw new Error(
    "Missing required production MONGODB_URI environment variable. " +
    "Render does not provide a local MongoDB instance. Set this value in your environment (e.g. MongoDB Atlas URI)."
  );
}

const activeMongodbUri = MONGODB_URI || "mongodb://localhost:27017/sai_marketing_db";

// -------------------------------------------------------------
// INTERFACES
// -------------------------------------------------------------

export interface IAdminCredential {
  username: string;
  passwordHash: string;
}

export interface ISetting {
  companyName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  officeHours?: string;
  announcement?: string;
}

export interface ICategory {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}

export interface IProduct {
  id: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  price?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  packSize?: string;
  manufacturer?: string;
  chemicalFormula?: string;
  createdAt?: string;
}

export interface ICustomer {
  id: string;
  name?: string;
  phone: string;
  password?: string;
  companyName?: string;
  email?: string;
  createdAt?: string;
}

export interface IInquiryProduct {
  productId?: string;
  productName?: string;
  quantity?: number;
}

export interface IInquiry {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  message?: string;
  status?: string;
  adminNotes?: string;
  callingConfirmed?: boolean;
  products?: IInquiryProduct[];
  createdAt?: string;
}

export interface IGalleryImage {
  id: string;
  url?: string;
  title?: string;
  category?: string;
  createdAt?: string;
}

export interface ITestimonial {
  id: string;
  name?: string;
  role?: string;
  company?: string;
  feedback?: string;
  rating?: number;
  createdAt?: string;
}

// -------------------------------------------------------------
// SCHEMAS & MODELS
// -------------------------------------------------------------

// Admin Credentials
const AdminCredentialSchema = new Schema<IAdminCredential>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});
export const AdminCredential = mongoose.model<IAdminCredential>("AdminCredential", AdminCredentialSchema, "admin_credentials");

// Settings
const SettingSchema = new Schema<ISetting>({
  companyName: String,
  ownerName: String,
  phone: String,
  email: String,
  address: String,
  whatsappNumber: String,
  facebookUrl: String,
  twitterUrl: String,
  linkedinUrl: String,
  officeHours: String,
  announcement: String
});
export const Setting = mongoose.model<ISetting>("Setting", SettingSchema, "settings");

// Categories
const CategorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: String,
  slug: { type: String, unique: true },
  description: String,
  image: String
});
export const Category = mongoose.model<ICategory>("Category", CategorySchema, "categories");

// Products
const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  description: String,
  image: String,
  price: String,
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  packSize: String,
  manufacturer: String,
  chemicalFormula: String,
  createdAt: String
});
export const Product = mongoose.model<IProduct>("Product", ProductSchema, "products");

// Customers
const CustomerSchema = new Schema<ICustomer>({
  id: { type: String, required: true, unique: true },
  name: String,
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: String,
  email: String,
  createdAt: String
});
export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema, "customers");

// Inquiries (including nested products)
const InquiryProductSchema = new Schema<IInquiryProduct>({
  productId: String,
  productName: String,
  quantity: Number
}, { _id: false });

const InquirySchema = new Schema<IInquiry>({
  id: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  email: String,
  companyName: String,
  message: String,
  status: { type: String, default: "pending" },
  adminNotes: String,
  callingConfirmed: { type: Boolean, default: false },
  products: [InquiryProductSchema],
  createdAt: String
});
export const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema, "inquiries");

// Gallery
const GalleryImageSchema = new Schema<IGalleryImage>({
  id: { type: String, required: true, unique: true },
  url: String,
  title: String,
  category: String,
  createdAt: String
});
export const GalleryImage = mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema, "gallery");

// Testimonials
const TestimonialSchema = new Schema<ITestimonial>({
  id: { type: String, required: true, unique: true },
  name: String,
  role: String,
  company: String,
  feedback: String,
  rating: Number,
  createdAt: String
});
export const Testimonial = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema, "testimonials");

// -------------------------------------------------------------
// INITIALIZATION & SEEDING
// -------------------------------------------------------------

export async function initDatabase() {
  console.log("Connecting to MongoDB at:", activeMongodbUri);
  await mongoose.connect(activeMongodbUri);
  console.log("Connected to MongoDB.");

  // Check if admin credentials collection is empty. If so, seed database.
  const adminCount = await AdminCredential.countDocuments();
  if (adminCount === 0) {
    console.log("Seeding database from database.json...");
    const dbPath = path.join(process.cwd(), "database.json");
    let seedData: any;
    if (fs.existsSync(dbPath)) {
      seedData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } else {
      // Fallback seed data if file doesn't exist
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("password123", salt);
      seedData = {
        credentials: { username: "admin", passwordHash: hashedPassword },
        settings: {
          companyName: "Sai Marketing Medical Agencies",
          ownerName: "Murali Krishna",
          phone: "+91 88867 12216",
          email: "muralikrisnna@gmail.com",
          address: "D.No. 10-5-268, Doddapuram Street, Reddy and Reddy's Colony, Tirupati, Andhra Pradesh – 517501, India",
          whatsappNumber: "+918886712216",
          officeHours: "Monday - Saturday: 9:00 AM - 8:00 PM (Sunday Closed)"
        },
        categories: [],
        products: [],
        gallery: [],
        testimonials: [],
        inquiries: [],
        customers: []
      };
    }

    // Insert admin credentials
    await AdminCredential.create({
      username: seedData.credentials.username,
      passwordHash: seedData.credentials.passwordHash
    });

    // Insert settings
    const s = seedData.settings;
    await Setting.create({
      companyName: s.companyName || null,
      ownerName: s.ownerName || null,
      phone: s.phone || null,
      email: s.email || null,
      address: s.address || null,
      whatsappNumber: s.whatsappNumber || null,
      facebookUrl: s.facebookUrl || null,
      twitterUrl: s.twitterUrl || null,
      linkedinUrl: s.linkedinUrl || null,
      officeHours: s.officeHours || null,
      announcement: s.announcement || null
    });

    // Insert categories
    if (seedData.categories && seedData.categories.length > 0) {
      await Category.insertMany(seedData.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image
      })));
    }

    // Insert products
    if (seedData.products && seedData.products.length > 0) {
      await Product.insertMany(seedData.products.map((prod: any) => ({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        description: prod.description,
        image: prod.image,
        price: prod.price,
        inStock: prod.inStock !== undefined ? !!prod.inStock : true,
        isFeatured: prod.isFeatured !== undefined ? !!prod.isFeatured : false,
        packSize: prod.packSize,
        manufacturer: prod.manufacturer,
        chemicalFormula: prod.chemicalFormula || null,
        createdAt: prod.createdAt || new Date().toISOString()
      })));
    }

    // Insert customers
    if (seedData.customers && seedData.customers.length > 0) {
      await Customer.insertMany(seedData.customers.map((cust: any) => ({
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        password: cust.password,
        companyName: cust.companyName,
        email: cust.email,
        createdAt: cust.createdAt || new Date().toISOString()
      })));
    }

    // Insert inquiries
    if (seedData.inquiries && seedData.inquiries.length > 0) {
      await Inquiry.insertMany(seedData.inquiries.map((inq: any) => ({
        id: inq.id,
        name: inq.name,
        phone: inq.phone,
        email: inq.email,
        companyName: inq.companyName,
        message: inq.message,
        status: inq.status || "pending",
        adminNotes: inq.adminNotes || null,
        callingConfirmed: inq.callingConfirmed !== undefined ? !!inq.callingConfirmed : false,
        products: (inq.products || []).map((p: any) => ({
          productId: p.productId,
          productName: p.productName,
          quantity: p.quantity
        })),
        createdAt: inq.createdAt || new Date().toISOString()
      })));
    }

    // Insert gallery
    if (seedData.gallery && seedData.gallery.length > 0) {
      await GalleryImage.insertMany(seedData.gallery.map((gal: any) => ({
        id: gal.id,
        url: gal.url,
        title: gal.title,
        category: gal.category,
        createdAt: gal.createdAt || new Date().toISOString()
      })));
    }

    // Insert testimonials
    if (seedData.testimonials && seedData.testimonials.length > 0) {
      await Testimonial.insertMany(seedData.testimonials.map((test: any) => ({
        id: test.id,
        name: test.name,
        role: test.role,
        company: test.company,
        feedback: test.feedback,
        rating: test.rating,
        createdAt: test.createdAt || new Date().toISOString()
      })));
    }
    console.log("Seeding completed successfully.");
  }
}
