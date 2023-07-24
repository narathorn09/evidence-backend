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
    group_status CHAR(1) NOT NULL,
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
    ef_photo VARCHAR(50) NULL,
    ef_detail VARCHAR(150) NULL,
    ef_status CHAR(1) NOT NULL,
    evidence_id INT NULL,
    PRIMARY KEY (ef_id),
    FOREIGN KEY (evidence_id) REFERENCES Evidence(evidence_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Assign (
    assign_id INT AUTO_INCREMENT,
    assign_direc_status CHAR(1) NOT NULL,
    assign_evi_result VARCHAR(10) NULL,
    assign_exp_status CHAR(1) NOT NULL,
    ef_id INT NOT NULL,
    group_id INT NOT NULL,
    expert_id INT NULL,
    PRIMARY KEY (assign_id),
    FOREIGN KEY (ef_id) REFERENCES Evidence_Factor(ef_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES Expert(expert_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Adding a Type Evidence
INSERT INTO Type_Evidence (type_e_name)
VALUES ('ขวดน้ำ');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('แก้วน้ำ');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('เสื้อ');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('กางเกง');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('กระเป๋า');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('มีด');
INSERT INTO Type_Evidence (type_e_name)
VALUES ('ปากกา');

-- Adding a Director
INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นางสาว', 'พ.ต.อ', 'ปิยวรรณ', 'อารักษ์คุณากร', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc1', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'ธนาธิป', 'กลิ่นโพธิ์', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc2', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'ภาธร', 'ปิติโอภาสพงศ์', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc3', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'จักรภพ', 'แสงกระจ่าง', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc4', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นางสาว', 'พ.ต.อ', 'ณัฏฐกานต์', 'ธนเจริญกิจ', @last_member_id);                                                                                                   

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc5', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาง', 'พ.ต.อ', 'สุชาดา', 'พิกุลเทพ', @last_member_id);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc6', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'วีระศักดิ์', 'เกียรติโกศล', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc7', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'บดินทร์', 'ผ่องรักษา', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc8', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'เอกภพ', 'อุดมภักดิ์', @last_member_id);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('3', 'direc9', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id)
VALUES ('นาย', 'พ.ต.อ', 'วีรชัย', 'วงศ์ทิพย์', @last_member_id);

-- Adding a Group
-- 0 เปิดกลุ่มงาน, 1 ปิดกลุ่มงาน
INSERT INTO GroupTable (group_name, director_id, group_status)
VALUES ('กลุ่มงานตรวจสถานที่เกิดเหตุ', 1, '0'),
       ('กลุ่มงานตรวจอาวุธปืนและเครื่องกระสุน', NULL, '1'),
       ('กลุ่มงานตรวจยาเสพติด', NULL, '1'),
       ('กลุ่มงานตรวจลายนิ้วมือแฝง', NULL, '1'),
       ('กลุ่มงานตรวจพิสูจน์ทางเคมีฟิสิกส์', NULL, '1'),
       ('กลุ่มงานตรวจชีววิทยาและดีเอ็นเอ', 2, '0'),
       ('กลุ่มงานผู้เชี่ยวชาญ', NULL, '1');

-- Adding a Admin
INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('0', 'admin', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Admin (admin_fname, admin_lname, mem_id)
VALUES ('นราธร', 'หนูพุ่ม', @last_member_id);

-- Adding a Commander
INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('1', 'com', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
VALUES ('นาย', 'พล.ต.ต.', 'เจตพัทธ์', 'ทรัพย์มา', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com1', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาง', 'พล.ต.ต.', 'Awatchana', 'Sukrungruaeng', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com2', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นางสาว', 'พล.ต.ต.', 'Areeya', 'Chongsatientam', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com3', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาย', 'พล.ต.ต.', 'Arnut', 'Charoonudomsuk', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com4', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาย', 'พล.ต.ต.', 'Supat', 'Suanchan', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com5', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาง', 'พล.ต.ต.', 'Suthisa', 'Tabiek', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com6', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาย', 'พล.ต.ต.', 'Supat', 'Suanchan', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com7', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นางสาว', 'พล.ต.ต.', 'Sophida', 'Kueanongkhun', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com8', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาย', 'พล.ต.ต.', 'Siripong', 'Kulsukrangsan', @last_member_id);

-- INSERT INTO Member (mem_type, mem_username, mem_password)
-- VALUES ('1', 'com9', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
-- SET @last_member_id = LAST_INSERT_ID();
-- INSERT INTO Commander (com_nametitle, com_rank, com_fname, com_lname, mem_id)
-- VALUES ('นาย', 'พล.ต.ต.', 'Sukson', 'Chaiyarat', @last_member_id);


-- Adding a Scene Investigator
INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.อ.', 'ฐิตาภา', 'ปัทมเดชา', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves1', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นาง', 'ร.ต.อ.', 'อภิลดา', 'พุ่มสนธิ', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves2', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.อ.', 'ณัฐวดี', 'วีระกิตติ', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves3', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นาย', 'พ.ต.ท', 'ภูวดี', 'สันติกสุล', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves4', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'พ.ต.ต.', 'ปิยะดา', 'ปราสาทงาม', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves5', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นาย', 'พ.ต.อ', 'ณภัทร', 'จรัสวงศ์', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves6', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.ท.', 'สุนิษา', 'พัฒนปรีชา', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves7', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'พ.ต.ต.', 'เรยา', 'รุ่งฤดี', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves8', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.อ.', 'ปรียาภัทร', 'รัศมีโชติ', @last_member_id, 1);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('2', 'inves9', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id)
VALUES ('นาย', 'ร.ต.อ.', 'ติณณภพ', 'โตศิลา', @last_member_id, 1);


-- Adding an Expert
INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาง', 'ร.ต.ต.', 'ลักษ์วิสา', 'รัศมีโชติ', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert1', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาง', 'ร.ต.ต.', 'ชมพู', 'วงศ์ทิพย์ ', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert2', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.ต.', 'วิมลพร', 'รัศมีโชติ', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert3', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาย', ' ร.ต.ท.', 'ธนิตย์', 'อุดมเสก', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert4', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาย', ' พ.ต.ต.', 'ยศภัทร', 'ทรัพย์ศิลา', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert5', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นางสาว', 'ร.ต.ท.', 'กมลฉันท์', 'ธนเจริญกิจ', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert6', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาย', ' ร.ต.อ.', 'ชยพล', 'งามขวัญ', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert7', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาง', 'ร.ต.ต.', 'ปาณิศา', 'นันทวัฒน์', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert8', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาง', ' ร.ต.ท.', 'กิรณา', 'สันติกสุล', @last_member_id, 6);

INSERT INTO Member (mem_type, mem_username, mem_password)
VALUES ('4', 'expert9', '$2a$10$F3EH9p.HgXgR4IExPsMvdOt0XoGsFZKGiR0ojh3YruNs1J01sdFam');
SET @last_member_id = LAST_INSERT_ID();
INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id)
VALUES ('นาย', 'ร.ต.ต.', 'สิรภพ', 'ขจรศักดิ์โกศล', @last_member_id, 6);
