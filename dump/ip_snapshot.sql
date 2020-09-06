-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2019 at 02:27 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_snapshot`
--

-- --------------------------------------------------------

--
-- Table structure for table `performancematrixuserresponse`
--

CREATE TABLE `performancematrixuserresponse` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `UserResponseId` longtext NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `performancematrixuserresponse`
--

INSERT INTO `performancematrixuserresponse` (`id`, `userId`, `UserResponseId`) VALUES
(1, 1, '1,1'),
(2, 1, '1,2'),
(3, 1, '1,-1'),
(4, 1, '1,1');

-- --------------------------------------------------------

--
-- Table structure for table `tbldepartments`
--

CREATE TABLE `tbldepartments` (
  `id` int(11) NOT NULL,
  `guid` char(45) NOT NULL,
  `departmentName` varchar(100) NOT NULL,
  `shortCode` varchar(10) DEFAULT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbldepartments`
--

INSERT INTO `tbldepartments` (`id`, `guid`, `departmentName`, `shortCode`, `isActive`, `createdOn`, `updatedOn`) VALUES
(1, 'a6abea62-4794-4771-b5b1-dce6b466d7f0', 'testing', 'test', b'1', '2019-09-15 15:26:06', '2019-09-15 10:54:53'),
(2, 'fc092555-1529-4e45-8a16-6abb89f0a6f6', 'new', 'newwqq', b'1', '2019-09-15 15:31:08', '2019-09-15 10:34:21');

-- --------------------------------------------------------

--
-- Table structure for table `tblperformancematrixparameters`
--

CREATE TABLE `tblperformancematrixparameters` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `guid` char(45) NOT NULL,
  `percentage` int(3) NOT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblperformancematrixparameters`
--

INSERT INTO `tblperformancematrixparameters` (`id`, `name`, `guid`, `percentage`, `isActive`, `createdOn`, `updatedOn`) VALUES
(1, 'test', '43e6beb4-f8de-4f4d-9b4d-01369c06ce7e', 10, b'1', '2019-09-15 18:53:41', '2019-09-15 13:23:41');

-- --------------------------------------------------------

--
-- Table structure for table `tblperformancematrixsubcategory`
--

CREATE TABLE `tblperformancematrixsubcategory` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `guid` char(45) NOT NULL,
  `parentId` int(11) NOT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblperformancematrixsubcategory`
--

INSERT INTO `tblperformancematrixsubcategory` (`id`, `name`, `guid`, `parentId`, `isActive`, `createdOn`, `updatedOn`) VALUES
(1, 'wwwqq', '10ddb871-2bc5-49f0-ae1e-4c95fcb20499', 1, b'1', '2019-09-15 19:35:11', '2019-09-15 14:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `tblpermissions`
--

CREATE TABLE `tblpermissions` (
  `id` int(11) NOT NULL,
  `moduleName` text NOT NULL,
  `permissionType` varchar(50) NOT NULL,
  `requestType` varchar(50) NOT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblpermissions`
--

INSERT INTO `tblpermissions` (`id`, `moduleName`, `permissionType`, `requestType`, `isActive`, `createdOn`, `updatedOn`) VALUES
(1, 'department', 'view', 'get', b'1', '2019-09-15 00:00:00', '2019-09-15 11:49:29'),
(2, 'department', 'create', 'post', b'1', '0000-00-00 00:00:00', '2019-09-15 11:49:29'),
(3, 'department', 'edit', 'patch', b'1', '2019-09-15 00:00:00', '2019-09-15 11:49:57'),
(4, 'department', 'delete', 'delete', b'1', '2019-09-15 00:00:00', '2019-09-15 11:50:15'),
(5, 'user', 'view', 'get', b'1', '2019-09-15 00:00:00', '2019-09-15 11:51:02'),
(6, 'user', 'create', 'post', b'1', '2019-09-15 00:00:00', '2019-09-15 11:51:02'),
(7, 'user', 'edit', 'patch', b'1', '2019-09-15 00:00:00', '2019-09-15 11:51:22'),
(8, 'user', 'delete', 'delete', b'1', '2019-09-15 00:00:00', '2019-09-15 11:51:33'),
(9, 'matrix', 'view', 'get', b'1', '2019-09-15 00:00:00', '2019-09-15 11:52:03'),
(10, 'matrix', 'create', 'post', b'1', '2019-09-15 00:00:00', '2019-09-15 11:52:12'),
(11, 'matrix', 'view', 'get', b'1', '2019-09-15 00:00:00', '2019-09-15 11:52:15'),
(12, 'matrix', 'create', 'post', b'1', '2019-09-15 00:00:00', '2019-09-15 11:52:18');

-- --------------------------------------------------------

--
-- Table structure for table `tblroles`
--

CREATE TABLE `tblroles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `roleType` tinyint(4) NOT NULL DEFAULT '2',
  `isDefault` bit(1) DEFAULT b'0',
  `isActive` bit(1) NOT NULL,
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblroles`
--

INSERT INTO `tblroles` (`id`, `name`, `roleType`, `isDefault`, `isActive`, `createdOn`, `updatedOn`) VALUES
(1, 'Admin', 1, b'0', b'1', '2019-09-14 00:00:00', '2019-09-14 11:44:00'),
(2, 'Member', 2, b'1', b'1', '2019-09-14 00:00:00', '2019-09-14 12:32:13');

-- --------------------------------------------------------

--
-- Table structure for table `tbluserdepartment`
--

CREATE TABLE `tbluserdepartment` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `departmentId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbluserdepartment`
--

INSERT INTO `tbluserdepartment` (`id`, `userId`, `departmentId`) VALUES
(6, 11, 2),
(5, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbluserpermission`
--

CREATE TABLE `tbluserpermission` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `permissionId` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbluserpermission`
--

INSERT INTO `tbluserpermission` (`id`, `userId`, `permissionId`) VALUES
(3, 10, '5|6|1|2');

-- --------------------------------------------------------

--
-- Table structure for table `tbluserrole`
--

CREATE TABLE `tbluserrole` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbluserrole`
--

INSERT INTO `tbluserrole` (`id`, `userId`, `roleId`) VALUES
(10, 11, 2),
(9, 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `id` int(11) NOT NULL,
  `guid` char(45) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `forgotToken` varchar(50) DEFAULT NULL,
  `authToken` varchar(50) DEFAULT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  `createdOn` datetime NOT NULL,
  `updatedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`id`, `guid`, `firstName`, `lastName`, `email`, `password`, `forgotToken`, `authToken`, `isActive`, `createdOn`, `updatedOn`) VALUES
(11, 'f5131289-e765-4ea8-b62f-578de7b2d3c1', 'test', 'test', 'test', 'sha1$19244e35$1$d8787c631775d164e758ca2a0ed5341db9fd8155', NULL, NULL, b'1', '2019-09-15 18:39:10', '2019-09-15 13:09:10'),
(10, 'a9849f07-1c8c-49a2-9188-70534acde022', 'Shubham', 'Julaha', 'shubham', 'sha1$f05700cf$1$21e53ba8bf89a290e755375c46e8f07c57146307', NULL, NULL, b'1', '2019-09-15 18:35:51', '2019-09-15 13:05:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `performancematrixuserresponse`
--
ALTER TABLE `performancematrixuserresponse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbldepartments`
--
ALTER TABLE `tbldepartments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblperformancematrixparameters`
--
ALTER TABLE `tblperformancematrixparameters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblperformancematrixsubcategory`
--
ALTER TABLE `tblperformancematrixsubcategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblpermissions`
--
ALTER TABLE `tblpermissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblroles`
--
ALTER TABLE `tblroles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbluserdepartment`
--
ALTER TABLE `tbluserdepartment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbluserpermission`
--
ALTER TABLE `tbluserpermission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbluserrole`
--
ALTER TABLE `tbluserrole`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `performancematrixuserresponse`
--
ALTER TABLE `performancematrixuserresponse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tbldepartments`
--
ALTER TABLE `tbldepartments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tblperformancematrixparameters`
--
ALTER TABLE `tblperformancematrixparameters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tblperformancematrixsubcategory`
--
ALTER TABLE `tblperformancematrixsubcategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tblpermissions`
--
ALTER TABLE `tblpermissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `tblroles`
--
ALTER TABLE `tblroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbluserdepartment`
--
ALTER TABLE `tbluserdepartment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `tbluserpermission`
--
ALTER TABLE `tbluserpermission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbluserrole`
--
ALTER TABLE `tbluserrole`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
