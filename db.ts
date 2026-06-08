import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import "dotenv/config";

const host = process.env.MYSQL_HOST || "localhost";
const port = parseInt(process.env.MYSQL_PORT || "3306");
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "";
const database = process.env.MYSQL_DATABASE || "sai_marketing_db";

export let pool: mysql.Pool;

export async function initDatabase() {
  console.log("Initializing database connection...");
  
  // Connect without database selected to make sure DB exists
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  // Create connection pool with database selected
  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      username VARCHAR(255) PRIMARY KEY,
      password_hash VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      company_name VARCHAR(255),
      owner_name VARCHAR(255),
      phone VARCHAR(50),
      email VARCHAR(255),
      address TEXT,
      whatsapp_number VARCHAR(50),
      facebook_url VARCHAR(255),
      twitter_url VARCHAR(255),
      linkedin_url VARCHAR(255),
      office_hours VARCHAR(255),
      announcement TEXT,
      CONSTRAINT single_row CHECK (id = 1)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      slug VARCHAR(255) UNIQUE,
      description TEXT,
      image TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      category VARCHAR(255),
      description TEXT,
      image TEXT,
      price VARCHAR(255),
      in_stock BOOLEAN,
      is_featured BOOLEAN,
      pack_size VARCHAR(255),
      manufacturer VARCHAR(255),
      chemical_formula VARCHAR(255),
      created_at VARCHAR(255)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(50) UNIQUE,
      password VARCHAR(255),
      company_name VARCHAR(255),
      email VARCHAR(255),
      created_at VARCHAR(255)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(50),
      email VARCHAR(255),
      company_name VARCHAR(255),
      message TEXT,
      status VARCHAR(50),
      admin_notes TEXT,
      calling_confirmed BOOLEAN DEFAULT FALSE,
      created_at VARCHAR(255)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiry_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      inquiry_id VARCHAR(50),
      product_id VARCHAR(50),
      product_name VARCHAR(255),
      quantity INT,
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id VARCHAR(50) PRIMARY KEY,
      url TEXT,
      title VARCHAR(255),
      category VARCHAR(255),
      created_at VARCHAR(255)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      role VARCHAR(255),
      company VARCHAR(255),
      feedback TEXT,
      rating INT,
      created_at VARCHAR(255)
    );
  `);

  // Seed if admin_credentials table is empty
  const [rows] = await pool.query<any[]>("SELECT COUNT(*) as count FROM admin_credentials");
  if (rows[0].count === 0) {
    console.log("Seeding database from database.json...");
    const dbPath = path.join(process.cwd(), "database.json");
    let seedData: any;
    if (fs.existsSync(dbPath)) {
      seedData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } else {
      // Fallback seed
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
    await pool.query("INSERT INTO admin_credentials (username, password_hash) VALUES (?, ?)", [
      seedData.credentials.username,
      seedData.credentials.passwordHash
    ]);

    // Insert settings
    const s = seedData.settings;
    await pool.query(
      `INSERT INTO settings (id, company_name, owner_name, phone, email, address, whatsapp_number, facebook_url, twitter_url, linkedin_url, office_hours, announcement)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.companyName || null,
        s.ownerName || null,
        s.phone || null,
        s.email || null,
        s.address || null,
        s.whatsappNumber || null,
        s.facebookUrl || null,
        s.twitterUrl || null,
        s.linkedinUrl || null,
        s.officeHours || null,
        s.announcement || null
      ]
    );

    // Insert categories
    if (seedData.categories) {
      for (const cat of seedData.categories) {
        await pool.query("INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)", [
          cat.id,
          cat.name,
          cat.slug,
          cat.description,
          cat.image
        ]);
      }
    }

    // Insert products
    if (seedData.products) {
      for (const prod of seedData.products) {
        await pool.query(
          `INSERT INTO products (id, name, category, description, image, price, in_stock, is_featured, pack_size, manufacturer, chemical_formula, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            prod.id,
            prod.name,
            prod.category,
            prod.description,
            prod.image,
            prod.price,
            prod.inStock ? 1 : 0,
            prod.isFeatured ? 1 : 0,
            prod.packSize,
            prod.manufacturer,
            prod.chemicalFormula || null,
            prod.createdAt || new Date().toISOString()
          ]
        );
      }
    }

    // Insert customers
    if (seedData.customers) {
      for (const cust of seedData.customers) {
        await pool.query(
          "INSERT INTO customers (id, name, phone, password, company_name, email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            cust.id,
            cust.name,
            cust.phone,
            cust.password,
            cust.companyName,
            cust.email,
            cust.createdAt || new Date().toISOString()
          ]
        );
      }
    }

    // Insert inquiries
    if (seedData.inquiries) {
      for (const inq of seedData.inquiries) {
        await pool.query(
          `INSERT INTO inquiries (id, name, phone, email, company_name, message, status, admin_notes, calling_confirmed, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            inq.id,
            inq.name,
            inq.phone,
            inq.email,
            inq.companyName,
            inq.message,
            inq.status,
            inq.adminNotes || null,
            inq.callingConfirmed ? 1 : 0,
            inq.createdAt || new Date().toISOString()
          ]
        );

        if (inq.products) {
          for (const item of inq.products) {
            await pool.query(
              "INSERT INTO inquiry_products (inquiry_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)",
              [inq.id, item.productId, item.productName, item.quantity]
            );
          }
        }
      }
    }

    // Insert gallery
    if (seedData.gallery) {
      for (const gal of seedData.gallery) {
        await pool.query("INSERT INTO gallery (id, url, title, category, created_at) VALUES (?, ?, ?, ?, ?)", [
          gal.id,
          gal.url,
          gal.title,
          gal.category,
          gal.createdAt || new Date().toISOString()
        ]);
      }
    }

    // Insert testimonials
    if (seedData.testimonials) {
      for (const test of seedData.testimonials) {
        await pool.query(
          "INSERT INTO testimonials (id, name, role, company, feedback, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            test.id,
            test.name,
            test.role,
            test.company,
            test.feedback,
            test.rating,
            test.createdAt || new Date().toISOString()
          ]
        );
      }
    }
    console.log("Seeding completed successfully.");
  }
}

export async function query(sql: string, params?: any[]) {
  if (!pool) {
    throw new Error("Database pool not initialized. Call initDatabase() first.");
  }
  return pool.query(sql, params);
}
