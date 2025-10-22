import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'record'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

testConnection();
initializeDatabase();

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

// Initialize database (create tables if they don't exist)
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create department table to match Sequelize model (without autoIncrement since Sequelize model doesn't have it)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS department (
        Deptid INT PRIMARY KEY,
        Deptname VARCHAR(100) NOT NULL,
        Deptacronym VARCHAR(10) NOT NULL
      )
    `);

    // Insert default departments if they don't exist (with manual IDs since no autoIncrement)
    await connection.query(`
      INSERT IGNORE INTO department (Deptid, Deptname, Deptacronym) VALUES 
      (1, 'Computer Science Engineering', 'CSE'),
      (2, 'Information Technology', 'IT'),
      (3, 'Electronics and Communication Engineering', 'ECE'),
      (4, 'Mechanical Engineering', 'MECH'),
      (5, 'Civil Engineering', 'CIVIL'),
      (6, 'Electrical and Electronics Engineering', 'EEE')
    `);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        Userid INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Student', 'Staff', 'Admin') NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        staffId INT UNIQUE,
        Deptid INT NOT NULL,
        image VARCHAR(500) DEFAULT '/uploads/default.jpg',
        resetPasswordToken VARCHAR(255),
        resetPasswordExpires DATETIME,
        skillrackProfile VARCHAR(255),
        Created_by INT,
        Updated_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Foreign key constraints
        CONSTRAINT fk_user_department FOREIGN KEY (Deptid) REFERENCES department(Deptid) ON DELETE RESTRICT,
        CONSTRAINT fk_user_createdby FOREIGN KEY (Created_by) REFERENCES users(Userid) ON DELETE SET NULL,
        CONSTRAINT fk_user_updatedby FOREIGN KEY (Updated_by) REFERENCES users(Userid) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS personal_information (
        id INT PRIMARY KEY AUTO_INCREMENT,
        Userid INT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        age INT,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(10) NOT NULL,
        communication_address TEXT NOT NULL,
        permanent_address TEXT NOT NULL,
        religion VARCHAR(100) NOT NULL,
        community VARCHAR(100) NOT NULL,
        caste VARCHAR(100) NOT NULL,
        post VARCHAR(255) NOT NULL,
        applied_date DATE,
        anna_university_faculty_id VARCHAR(100),
        aicte_faculty_id VARCHAR(100),
        orcid VARCHAR(100),
        researcher_id VARCHAR(100),
        google_scholar_id VARCHAR(100),
        scopus_profile VARCHAR(255),
        vidwan_profile VARCHAR(255),
        supervisor_id INT,
        h_index INT,
        citation_index INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE KEY unique_user_personal_info (Userid),
        UNIQUE KEY unique_email (email),
        
        -- Indexes for better performance
        INDEX idx_email (email),
        INDEX idx_post (post),
        INDEX idx_Userid (Userid),
        INDEX idx_full_name (full_name),
        
        -- Foreign key constraint
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE,
        
        -- Check constraints for data validation
        CHECK (age >= 0 AND age <= 150),
        CHECK (h_index >= 0),
        CHECK (citation_index >= 0),
        CHECK (LENGTH(mobile_number) = 10),
        CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS consultancy_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        pi_name VARCHAR(255) NOT NULL,
        co_pi_names TEXT,
        project_title VARCHAR(500) NOT NULL,
        industry VARCHAR(255) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        proof TEXT,
        organization_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create payment details table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_id INT NOT NULL,
        date DATE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (proposal_id) REFERENCES consultancy_proposals(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS project_proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        pi_name VARCHAR(100) NOT NULL,
        co_pi_names TEXT,
        project_title VARCHAR(255) NOT NULL,
        funding_agency VARCHAR(100) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        proof TEXT,
        organization_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS project_payment_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proposal_id INT NOT NULL,
        date DATE NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (proposal_id) REFERENCES project_proposals(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS events_attended (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        programme_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        mode ENUM('Online','Offline','Hybrid') NOT NULL,
        organized_by VARCHAR(100) NOT NULL,
        participants INT NOT NULL,
        financial_support BOOLEAN DEFAULT FALSE,
        support_amount DECIMAL(10,2),
        permission_letter_link TEXT,
        certificate_link TEXT,
        financial_proof_link TEXT,
        programme_report_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create industry_knowhow table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS industry_knowhow (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        internship_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(100) NOT NULL,
        outcomes TEXT NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        venue VARCHAR(100) NOT NULL,
        participants INT NOT NULL,
        financial_support BOOLEAN DEFAULT FALSE,
        support_amount DECIMAL(10,2),
        certificate_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create certification_courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certification_courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        forum VARCHAR(100) NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        days INT NOT NULL,
        certification_date DATE NOT NULL,
        certificate_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create book_chapters table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS book_chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        publication_type ENUM('journal', 'book_chapter', 'conference') NOT NULL DEFAULT 'book_chapter',
        publication_name VARCHAR(255) NOT NULL COMMENT 'Journal name, Book name, or Conference name',
        publication_title VARCHAR(500) NOT NULL COMMENT 'Title of the article/chapter/paper',
        authors TEXT NOT NULL COMMENT 'Comma separated list of authors',
        index_type ENUM('Scopus', 'SCI', 'SCIE', 'SSCI', 'A&HCI', 'ESCI', 'UGC CARE', 'Other') NOT NULL,
        doi VARCHAR(100) NULL COMMENT 'Digital Object Identifier',
        citations INT DEFAULT 0 COMMENT 'Number of citations',
        publisher VARCHAR(200) NULL COMMENT 'Publisher name',
        page_no VARCHAR(50) NULL COMMENT 'Page numbers (e.g., 123-130)',
        publication_date DATE NOT NULL COMMENT 'Publication date',
        impact_factor DECIMAL(6,3) NULL COMMENT 'Journal impact factor',
        publication_link VARCHAR(500) NULL COMMENT 'URL to the publication',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE,
        
        -- Indexes for better performance
        INDEX idx_user_publication_type (Userid, publication_type),
        INDEX idx_publication_date (publication_date),
        INDEX idx_index_type (index_type),
        INDEX idx_created_at (created_at)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS h_index (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        faculty_name VARCHAR(100) NOT NULL,
        citations INT NOT NULL,
        h_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create proposals_submitted table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS proposals_submitted (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        faculty_name VARCHAR(100) NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        register_number VARCHAR(50),
        project_title VARCHAR(255) NOT NULL,
        funding_agency VARCHAR(100) NOT NULL,
        project_duration VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        proof_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create resource_person table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_person (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        program_specification VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        venue VARCHAR(100) NOT NULL,
        event_date DATE NOT NULL,
        proof_link TEXT,
        photo_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS education (
        id INT PRIMARY KEY AUTO_INCREMENT,
        Userid INT NOT NULL,
        
        -- 10th Standard fields
        tenth_institution VARCHAR(255),
        tenth_university VARCHAR(255),
        tenth_medium VARCHAR(100),
        tenth_cgpa_percentage VARCHAR(50),
        tenth_first_attempt ENUM('Yes', 'No'),
        tenth_year YEAR,
        
        -- 12th Standard fields
        twelfth_institution VARCHAR(255),
        twelfth_university VARCHAR(255),
        twelfth_medium VARCHAR(100),
        twelfth_cgpa_percentage VARCHAR(50),
        twelfth_first_attempt ENUM('Yes', 'No'),
        twelfth_year YEAR,
        
        -- Undergraduate fields
        ug_institution VARCHAR(255),
        ug_university VARCHAR(255),
        ug_medium VARCHAR(100),
        ug_specialization VARCHAR(255),
        ug_degree VARCHAR(255),
        ug_cgpa_percentage VARCHAR(50),
        ug_first_attempt ENUM('Yes', 'No'),
        ug_year YEAR,
        
        -- Postgraduate fields
        pg_institution VARCHAR(255),
        pg_university VARCHAR(255),
        pg_medium VARCHAR(100),
        pg_specialization VARCHAR(255),
        pg_degree VARCHAR(255),
        pg_cgpa_percentage VARCHAR(50),
        pg_first_attempt ENUM('Yes', 'No'),
        pg_year YEAR,
        
        -- MPhil fields
        mphil_institution VARCHAR(255),
        mphil_university VARCHAR(255),
        mphil_medium VARCHAR(100),
        mphil_specialization VARCHAR(255),
        mphil_degree VARCHAR(255),
        mphil_cgpa_percentage VARCHAR(50),
        mphil_first_attempt ENUM('Yes', 'No'),
        mphil_year YEAR,
        
        -- PhD fields
        phd_university VARCHAR(255),
        phd_title VARCHAR(500),
        phd_guide_name VARCHAR(255),
        phd_college VARCHAR(255),
        phd_status ENUM('Ongoing', 'Completed', 'Submitted', 'Awarded'),
        phd_registration_year YEAR,
        phd_completion_year YEAR,
        phd_publications_during TEXT,
        phd_publications_post TEXT,
        phd_post_experience TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE,
        INDEX idx_Userid (Userid)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS scholars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        scholar_name VARCHAR(100) NOT NULL,
        scholar_type VARCHAR(20) NOT NULL,
        institute VARCHAR(150),
        university VARCHAR(150),
        title VARCHAR(255),
        domain VARCHAR(100),
        phd_registered_year YEAR,
        completed_year YEAR,
        status VARCHAR(50),
        publications TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create seed_money table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS seed_money (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        project_title VARCHAR(255) NOT NULL,
        project_duration VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        outcomes TEXT NOT NULL,
        proof_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create recognition_appreciation table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recognition_appreciation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        program_name VARCHAR(255) NOT NULL,
        recognition_date DATE NOT NULL,
        proof_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create patent_product table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patent_product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        project_title VARCHAR(255) NOT NULL,
        patent_status VARCHAR(50) NOT NULL,
        month_year VARCHAR(50) NOT NULL,
        patent_proof_link TEXT,
        working_model BOOLEAN DEFAULT FALSE,
        working_model_proof_link TEXT,
        prototype_developed BOOLEAN DEFAULT FALSE,
        prototype_proof_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS project_mentors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        project_title VARCHAR(255) NOT NULL,
        student_details TEXT NOT NULL,
        event_details VARCHAR(255) NOT NULL,
        participation_status VARCHAR(100) NOT NULL,
        certificate_link TEXT,
        proof_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create sponsored_research table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sponsored_research (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        pi_name VARCHAR(100) NOT NULL,
        co_pi_names TEXT,
        project_title VARCHAR(255) NOT NULL,
        funding_agency VARCHAR(100) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        proof TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Create events_organized table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events_organized (
        id INT AUTO_INCREMENT PRIMARY KEY,
        Userid INT NOT NULL,
        program_name VARCHAR(255) NOT NULL,
        program_title VARCHAR(255) NOT NULL,
        coordinator_name VARCHAR(100) NOT NULL,
        co_coordinator_names TEXT,
        speaker_details TEXT NOT NULL,
        from_date DATE NOT NULL,
        to_date DATE NOT NULL,
        days INT NOT NULL,
        sponsored_by VARCHAR(100),
        amount_sanctioned DECIMAL(10,2),
        participants INT NOT NULL,
        proof_link TEXT,
        documentation_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Userid) REFERENCES users(Userid) ON DELETE CASCADE
      )
    `);

    // Insert default admin user if it doesn't exist
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['faculty']);
    if (rows.length === 0) {
      // Get the first department ID
      const [deptRows] = await connection.query('SELECT Deptid FROM department LIMIT 1');
      const defaultDeptId = deptRows[0]?.Deptid || 1;
      
      // Insert default faculty user
      await connection.query(`
        INSERT INTO users (username, password, email, role, Deptid) 
        VALUES (?, ?, ?, ?, ?)
      `, ['faculty', '$2b$10$8DaSlKea.xlHPElfW8ek3.LZVIpzQdh47/qZ.n9AEWlDUfzA6OgYi', 'faculty@example.com', 'Staff', defaultDeptId]);
      console.log('Default faculty user created');
    }

    connection.release();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return false;
  }
}

// Export connection pool and utilities
export { pool, testConnection, initializeDatabase };