-- Adminer 4.8.1 MySQL 8.0.23 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `when` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `event` (`id`, `description`, `address`, `name`, `when`) VALUES
(1,	'Let\'s meet together.',	'Office St 120',	'Team Meetup',	'2021-02-15 21:00:00'),
(2,	'Let\'s learn something.',	'Workshop St 80',	'Workshop',	'2021-02-17 21:00:00'),
(3,	'Let\'s meet with big bosses',	'Boss St 100',	'Strategy Meeting',	'2021-02-17 21:00:00'),
(4,	'Let\'s try to sell stuff',	'Money St 34',	'Sales Pitch',	'2021-02-11 21:00:00'),
(5,	'People meet to talk about business ideas',	'Invention St 123',	'Founders Meeting',	'2021-02-12 21:00:00'),
(6,	'people meet talk about business ideas',	'Convetion center St 123',	'World\'s Biggest Ass Convention.',	'2021-07-28 21:00:00'),
(7,	'people meet talk about business ideas',	'Convention center ',	'Woolapapaloosa',	'2021-07-28 21:00:00');

-- 2021-07-03 14:28:01
