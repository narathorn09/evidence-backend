CREATE DATABASE Forensic_Science;

USE Forensic_Science;

CREATE TABLE Member (
    mem_id INT AUTO_INCREMENT,
    mem_type ENUM('0', '1', '2', '3', '4') NOT NULL,
    mem_username VARCHAR(20) NOT NULL,
    mem_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (mem_id),
    UNIQUE KEY mem_username_unique (mem_username)
);

CREATE TABLE RefreshToken (
    token_id INT AUTO_INCREMENT,
    mem_id INT,
    refresh_token VARCHAR(1000) NULL,
    createdAt TIMESTAMP(2) NULL,
    PRIMARY KEY (token_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Commander (
    com_id INT AUTO_INCREMENT,
    com_nametitle VARCHAR(6) NOT NULL,
    com_rank VARCHAR(8) NOT NULL,
    com_fname VARCHAR(50) NOT NULL,
    com_lname VARCHAR(50) NOT NULL,
    mem_id INT NOT NULL,
    PRIMARY KEY (com_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT,
    admin_fname VARCHAR(50) NOT NULL,
    admin_lname VARCHAR(50) NOT NULL,
    mem_id INT NOT NULL,
    PRIMARY KEY (admin_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Director (
    director_id INT AUTO_INCREMENT,
    director_nametitle VARCHAR(6) NOT NULL,
    director_rank VARCHAR(8) NOT NULL,
    director_fname VARCHAR(50) NOT NULL,
    director_lname VARCHAR(50) NOT NULL,
    mem_id INT NOT NULL,
    PRIMARY KEY (director_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE GroupTable (
    group_id INT AUTO_INCREMENT,
    group_name VARCHAR(50) NOT NULL,
    director_id INT NULL,
    PRIMARY KEY (group_id),
    FOREIGN KEY (director_id) REFERENCES Director(director_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE Scene_investigators (
    inves_id INT AUTO_INCREMENT,
    inves_nametitle VARCHAR(6) NOT NULL,
    inves_rank VARCHAR(8) NOT NULL,
    inves_fname VARCHAR(50) NOT NULL,
    inves_lname VARCHAR(50) NOT NULL,
    mem_id INT NOT NULL,
    group_id INT NULL,
    PRIMARY KEY (inves_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE Expert (
    expert_id INT AUTO_INCREMENT,
    expert_nametitle VARCHAR(6) NOT NULL,
    expert_rank VARCHAR(8) NOT NULL,
    expert_fname VARCHAR(50) NOT NULL,
    expert_lname VARCHAR(50) NOT NULL,
    mem_id INT NOT NULL,
    group_id INT NULL,
    PRIMARY KEY (expert_id),
    FOREIGN KEY (mem_id) REFERENCES Member(mem_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE CaseTable (
    case_id INT AUTO_INCREMENT,
    case_numboko VARCHAR(10) NOT NULL,
    case_save_date DATE NOT NULL,
    case_save_time TIME NOT NULL,
    case_accident_date DATE NOT NULL,
    case_accident_time TIME NOT NULL,
    case_location VARCHAR(150) NOT NULL,
    case_type VARCHAR(50) NOT NULL,
    case_status CHAR(1) NOT NULL,
    inves_id INT NULL,
    PRIMARY KEY (case_id),
    FOREIGN KEY (inves_id) REFERENCES Scene_investigators(inves_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE Type_Evidence (
    type_e_id INT AUTO_INCREMENT,
    type_e_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (type_e_id)
);

CREATE TABLE Evidence (
    evidence_id INT AUTO_INCREMENT,
    evidence_amount INT NOT NULL,
    case_id INT NOT NULL,
    type_e_id INT NULL,
    PRIMARY KEY (evidence_id),
    FOREIGN KEY (case_id) REFERENCES CaseTable(case_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (type_e_id) REFERENCES Type_Evidence(type_e_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE Evidence_Factor (
    ef_id INT AUTO_INCREMENT,
    ef_photo VARCHAR(20) NOT NULL,
    ef_detail VARCHAR(150) NULL,
    ef_status CHAR(1) NOT NULL,
    evidence_id INT NULL,
    PRIMARY KEY (ef_id),
    FOREIGN KEY (evidence_id) REFERENCES Evidence(evidence_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Assign (
    assign_id INT AUTO_INCREMENT,
    assign_direc_status CHAR(1) NOT NULL,
    assign_evi_result VARCHAR(10) NOT NULL,
    assign_exp_status CHAR(1) NOT NULL,
    evidence_id INT NOT NULL,
    group_id INT NOT NULL,
    expert_id INT NULL,
    PRIMARY KEY (assign_id),
    FOREIGN KEY (evidence_id) REFERENCES Evidence(evidence_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES Expert(expert_id) ON UPDATE CASCADE ON DELETE SET NULL
);

INSERT INTO GroupTable (group_name, director_id)
VALUES ('กลุ่มงานตรวจสถานที่เกิดเหตุ', NULL),
       ('กลุ่มงานตรวจอาวุธปืนและเครื่องกระสุน', NULL),
       ('กลุ่มงานตรวจยาเสพติด', NULL),
       ('กลุ่มงานตรวจลายนิ้วมือแฝง', NULL),
       ('กลุ่มงานตรวจพิสูจน์ทางเคมีฟิสิกส์', NULL),
       ('กลุ่มงานตรวจชีววิทยาและดีเอ็นเอ', NULL),
       ('กลุ่มงานผู้เชี่ยวชาญ', NULL);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('0', 'admin', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Admin (admin_fname, admin_lname, mem_id)
VALUES ('Narathorn', 'Noophum', @last_member_id);
