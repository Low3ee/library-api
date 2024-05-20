-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2024 at 02:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(8) NOT NULL DEFAULT uuid(),
  `name` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `category` int(11) NOT NULL,
  `condition` enum('new','good','bad','') DEFAULT 'new',
  `added_by` int(11) NOT NULL,
  `added_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `name`, `author`, `category`, `condition`, `added_by`, `added_date`) VALUES
(0, 'Booking', 'biot', 0, 'new', 93, '2024-05-19 20:59:52'),
(3, 'Book C', 'Juan Dela Cruz', 0, 'new', 93, '2024-05-16 20:12:56'),
(4, 'Book D', 'Batang Quiapo', 0, 'new', 93, '2024-05-16 20:12:56'),
(5, 'Book E', 'Reymond Go', 0, 'new', 93, '2024-05-16 20:12:56'),
(7, 'libro rani', 'ikaw', 0, 'new', 93, '2024-05-19 13:33:59'),
(23, 'Book 69', 'Iring Kabang', 0, 'new', 93, '2024-05-16 22:46:27'),
(61, 'Book 12', 'Jelmat Rose', 0, 'new', 93, '2024-05-17 07:02:04'),
(63, 'book F', 'andriel labad', 0, 'new', 93, '2024-05-17 00:01:46'),
(84, 'Book of OZ', 'ambot', 0, 'new', 93, '2024-05-19 13:27:02'),
(527, 'Book of spells', 'magus', 0, 'new', 93, '2024-05-19 13:25:37'),
(7778, 'book69', 'iring', 0, 'new', 93, '2024-05-16 23:17:41'),
(2147483647, 'Book 89', 'si Jumong', 0, 'new', 93, '2024-05-16 22:55:41');

-- --------------------------------------------------------

--
-- Table structure for table `borrowedbook`
--

CREATE TABLE `borrowedbook` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bookId` int(11) NOT NULL,
  `date_borrowed` date NOT NULL DEFAULT current_timestamp(),
  `date_due` date DEFAULT NULL,
  `returned` tinyint(1) DEFAULT 0,
  `fine` int(5) NOT NULL,
  `remarks` varchar(150) NOT NULL,
  `issued_by` int(11) DEFAULT 93
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowedbook`
--

INSERT INTO `borrowedbook` (`id`, `user_id`, `bookId`, `date_borrowed`, `date_due`, `returned`, `fine`, `remarks`, `issued_by`) VALUES
(6411, 5, 7778, '2024-05-20', '2024-05-19', 1, 200, 'ripped pages', 93),
(6412, 5, 61, '2024-05-20', '2024-05-24', 0, 0, '', 93),
(6413, 5, 23, '2024-05-20', '2024-05-22', 0, 0, '', 93);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL DEFAULT uuid(),
  `role` int(11) NOT NULL DEFAULT 1,
  `name` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `enrolled` tinyint(1) DEFAULT 1,
  `password` varchar(255) NOT NULL,
  `course` varchar(10) NOT NULL,
  `year_level` int(1) NOT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `balance` int(6) DEFAULT 0,
  `username` varchar(50) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `date_created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role`, `name`, `email`, `enrolled`, `password`, `course`, `year_level`, `contact_no`, `balance`, `username`, `last_login`, `date_created`) VALUES
(5, 1, 'Louie Abad', 'louieabad000@mgial.com', 1, '$2b$10$rYSSyCd.tQuEuagDsP67cO.vjfwiXkSmQQOWelU9mWFW.bebVrNYW', 'WADT', 3, '09227720034', 200, 'Low3ee', '2024-05-20 00:03:27', '2024-05-14'),
(93, 5, 'super admin', 'aclccollegelibrarian@aclc.com', 1, '$2b$10$6pHl0LfK8aEA1TynWpMfSOM2FeC8P/IJt.AqwCSJyuapjvxuugWw.', 'Librarian', 99, '0922770034,', 0, 'superRoot', '2024-05-20 00:01:34', '2024-05-17'),
(191, 1, 'Johnlord Bongo', 'johnlord0232@gmail.com', 1, '$2b$10$6pHl0LfK8aEA1TynWpMfSOM2FeC8P/IJt.AqwCSJyuapjvxuugWw.', 'BSM', 2, '09238841232', 0, 'manyak.123', '2024-05-15 21:30:23', '2024-05-16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `id_2` (`id`),
  ADD UNIQUE KEY `id_3` (`id`);

--
-- Indexes for table `borrowedbook`
--
ALTER TABLE `borrowedbook`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrowedbook`
--
ALTER TABLE `borrowedbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6414;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
