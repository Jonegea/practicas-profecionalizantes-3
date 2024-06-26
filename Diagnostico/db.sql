-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-05-2024 a las 05:25:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `2daprueba`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_masivo` (IN `p_Localidad` VARCHAR(100), IN `p_codigoUTA2020` VARCHAR(255), IN `p_codigoUTA2010` VARCHAR(255), IN `p_Latitud` DECIMAL(10,8), IN `p_Longitud` DECIMAL(11,8), IN `p_Municipio` VARCHAR(100), IN `p_Departamento` VARCHAR(100), IN `p_Provincia` VARCHAR(255))   BEGIN
    DECLARE provincia_id INT;
    DECLARE departamento_id INT;
    DECLARE municipio_id INT;

    -- Insertar o actualizar la provincia (si no existe)
    INSERT INTO provincia (nombre) VALUES (p_Provincia)
    ON DUPLICATE KEY UPDATE nombre = nombre;

    -- Obtener el ID de la provincia
    SELECT id INTO provincia_id FROM provincia WHERE nombre = p_Provincia;

    -- Si no se encontró la provincia, obtener el ID insertado
    IF provincia_id IS NULL THEN
        SET provincia_id = LAST_INSERT_ID();
    END IF;

    -- Obtener o insertar el departamento asociado a la provincia
    SELECT id INTO departamento_id FROM departamento WHERE nombre = p_Departamento AND id_provincia = provincia_id;
    IF departamento_id IS NULL THEN
        INSERT INTO departamento (nombre, id_provincia) VALUES (p_Departamento, provincia_id);
        SET departamento_id = LAST_INSERT_ID();
    END IF;

    -- Obtener o insertar el municipio asociado al departamento
    SELECT id INTO municipio_id FROM municipio WHERE nombre = p_Municipio AND id_departamento = departamento_id;
    IF municipio_id IS NULL THEN
        INSERT INTO municipio (nombre, id_departamento) VALUES (p_Municipio, departamento_id);
        SET municipio_id = LAST_INSERT_ID();
    END IF;

    -- Insertar la localidad asociada al municipio
    INSERT INTO localidad (nombre, codigoUTA2020, codigoUTA2010, latitud, longitud, id_municipio)
    VALUES (p_Localidad, p_codigoUTA2020, p_codigoUTA2010, p_Latitud, p_Longitud, municipio_id);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `id_provincia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`id`, `nombre`, `id_provincia`) VALUES
(23, 'GENERAL DONOVAN', 487),
(24, 'ISCHILIN', 491),
(25, 'LANGUIÑEO', 495),
(26, 'RIO SENGUER', 495),
(27, 'HURLINGHAM', 497),
(28, 'CONSTITUCION', 500),
(29, 'GENERAL PEDERNERA', 503),
(30, 'COCHINOCA', 507),
(31, 'GAIMAN', 495),
(32, 'EL CUY', 518),
(33, 'SALAVINA', 519),
(34, 'MALARGUE', 520),
(35, 'MINAS', 491),
(36, 'IRIONDO', 500),
(37, 'LAGO ARGENTINO', 552),
(38, 'COLON', 497),
(39, 'BENITO JUAREZ', 497),
(40, 'FEDERACION', 570),
(41, '12 DE OCTUBRE', 487),
(42, 'UNION', 491),
(43, 'GUALEGUAY', 570),
(44, 'LA CALDERA', 575),
(45, 'FRAY MAMERTO ESQUIU', 584),
(46, 'OLAVARRIA', 497),
(47, 'CASTELLANOS', 500),
(48, 'CASEROS', 500),
(49, 'SANTA VICTORIA', 575),
(50, 'METAN', 575),
(51, 'LA PAZ', 570),
(52, 'CURACO', 669),
(53, 'ROSARIO', 500),
(54, 'GENERAL BELGRANO', 487),
(55, 'LIBERTADOR GENERAL SAN MARTÍN', 503),
(56, 'DESEADO', 552),
(57, 'SANAGASTA', 687),
(58, 'ALMIRANTE BROWN', 497),
(59, 'FEDERAL', 570),
(60, 'JOSE C PAZ', 497),
(61, 'SARMIENTO', 519),
(62, 'ROJAS', 497),
(63, 'AGUIRRE', 519),
(64, 'CALAMUCHITA', 491),
(65, 'MAGALLANES', 552),
(66, 'SAN CRISTOBAL', 500),
(67, 'TILCARA', 507),
(68, 'CORONEL PRINGLES', 503),
(69, '25 DE MAYO', 518),
(70, 'GENERAL BELGRANO', 497),
(71, 'LAVALLE', 758),
(72, 'MAYOR LUIS J FONTANA', 487),
(73, 'LAS COLONIAS', 500),
(74, 'RIO SECO', 491),
(75, 'LIBERTADOR GENERAL SAN MARTÍN', 792),
(76, 'POCHO', 491),
(77, 'GENERAL SAN MARTIN', 491),
(78, 'GUALEGUAYCHU', 570),
(79, 'DIAMANTE', 570),
(80, 'TUMBAYA', 507),
(81, 'MARCOS JUAREZ', 491),
(82, 'GENERAL GUEMES', 487),
(83, 'COLON', 491),
(84, 'GENERAL LOPEZ', 500),
(85, 'SAN MARTIN', 500),
(86, 'LA CANDELARIA', 575),
(87, 'SANTA MARÍA', 491),
(88, 'SAN CARLOS', 520);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidad`
--

CREATE TABLE `localidad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `codigoUTA2020` varchar(255) DEFAULT NULL,
  `codigoUTA2010` varchar(255) DEFAULT NULL,
  `longitud` varchar(255) DEFAULT NULL,
  `latitud` varchar(255) DEFAULT NULL,
  `id_municipio` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidad`
--

INSERT INTO `localidad` (`id`, `nombre`, `codigoUTA2020`, `codigoUTA2010`, `longitud`, `latitud`, `id_municipio`) VALUES
(13527, 'LA ESCONDIDA', '220560140010000', '220560140010000', '-59.44753251', '-27.10732485', 19),
(13531, 'LAS CHACRAS', '140490378000078', '140490378000078', '-64.37897808', '-30.28576787', 20),
(13535, 'CARRENLEUFU', '260568056020000', '260568056020000', '-71.70090202', '-43.58568854', 21),
(13536, 'LAGO BLANCO', '260848112060000', '260848112060000', '-71.26411066', '-45.94685942', 22),
(13537, 'VILLA SANTOS TESEI', '064080408010002', '064080408010002', '-58.65381037', '-34.61239444', 23),
(13540, 'ORATORIO MORANTE', '820282455000018', '820282455000018', '-60.40251923', '-33.43350220', 24),
(13543, 'VILLA MERCEDES', '740350077070002', '740350077070002', '-65.47314337', '-33.67736978', 25),
(13547, 'SAN FRANCISCO DE ALFARCITO', '380076007080000', '380076007080000', '-65.94638046', '-23.27530252', 26),
(13557, '28 DE JULIO', '260425014040000', '260425014040000', '-65.83868774', '-43.38097713', 27),
(13558, 'NAUPA HUEN', '620355098060000', '620355098060000', '-69.50897269', '-39.82828459', 28),
(13559, 'CHILCA JULIANA', '861686259010000', '861686259010000', '-63.48677734', '-28.80748336', 29),
(13560, 'EL MANZANO', '500770077000049', '500770077000049', '-69.76119900', '-36.10700800', 30),
(13583, 'MOGOTES ASPEROS', '140702371000035', '140702371000035', '-65.24743586', '-31.18595404', 31),
(13589, 'CORREA', '820562903070000', '820562903070000', '-61.25455691', '-32.84946108', 32),
(13592, 'EL CHALTEN', '780285028020000', '780285028020000', '-72.89162671', '-49.33197312', 33),
(13593, 'EL ARBOLITO', '061750175020000', '061750175020000', '-60.94380819', '-33.91478380', 34),
(13599, 'KILOMETRO 404', '060840084000007', '060840084000007', '-59.85290000', '-37.64380000', 35),
(13610, 'LOS CONQUISTADORES', '300280115080000', '300280115080000', '-58.46826271', '-30.59440746', 36),
(13611, 'GANCEDO', '220360091010000', '220360091010000', '-61.67387717', '-27.48964879', 37),
(13613, 'LABORDE', '141821666150000', '141821666150000', '-62.85607378', '-33.15298918', 38),
(13614, 'GENERAL GALARZA', '300490168030000', '300490168030000', '-59.39588870', '-32.72127131', 39),
(13615, 'MOJOTORO', '660770189000049', '660770189000049', '-65.28838348', '-24.70934677', 40),
(13624, 'LA FALDA DE SAN ANTONIO', '100630161040003', '100630161040003', '-65.69883780', '-28.41984873', 41),
(13635, 'CRUCE MUÑOZ', '065950595000012', '065950595000012', '-60.64633650', '-37.18206920', 42),
(13677, 'COLONIA ITURRASPE', '820212182000028', '820212182000028', '-61.62158000', '-31.47881950', 43),
(13678, 'COLONIA LA POSTA', '820142028000009', '820142028000009', '-61.48772334', '-33.05094527', 44),
(13680, 'SAN JOSE DE AGUILAR', '661610413000134', '661610413000134', '-65.17109986', '-22.34120267', 45),
(13705, 'RIO PIEDRAS', '661120280070000', '661120280070000', '-64.91732943', '-25.32118188', 46),
(13708, 'SAN RAMIREZ', '300709495000106', '300709495000106', '-59.34085823', '-30.46341428', 47),
(13709, 'LIHUEL CALEL', '420840280000005', '420840280000005', '-65.58481895', '-38.01481736', 48),
(13711, 'GENERAL LAGOS', '820843407150000', '820843407150000', '-60.56657378', '-33.11215889', 49),
(13712, 'PAMPA LA PORTEÑA', '220490133000011', '220490133000011', '-61.11934234', '-26.89174656', 50),
(13721, 'LA CIENAGA', '740636294000091', '740636294000091', '-65.48777771', '-32.41791916', 51),
(13726, 'CAÑADON SECO', '780145007020000', '780145007020000', '-67.61685637', '-46.55884577', 52),
(13727, 'LA ESCALERA', '461260126000005', '461260126000005', '-67.15747070', '-29.14089012', 53),
(13731, 'ADROGUE', '060280028010001', '060280028010001', '-58.39146772', '-34.80155807', 54),
(13743, 'BELL VILLE', '141821610060000', '141821610060000', '-62.68911491', '-32.62856008', 55),
(13745, 'CALETA OLIVIA', '780140021010000', '780140021010000', '-67.52515650', '-46.44594923', 56),
(13746, 'NUEVA VIZCAYA', '300359215040000', '300359215040000', '-58.61274793', '-30.96851498', 57),
(13747, 'TORTUGUITAS', '064120412010003', '064120412010003', '-58.78637803', '-34.49184840', 58),
(13750, 'GARZA', '861826287010000', '861826287010000', '-63.46934561', '-28.16406406', 59),
(13751, 'LA VIGIA', '066860686000018', '066860686000018', '-60.62451840', '-34.30649550', 60),
(13774, 'VILLA GENERAL MITRE', '860070007040000', '860070007040000', '-62.56239605', '-29.13963572', 61),
(13775, 'SAN ROQUE', '140072007000058', '140072007000058', '-64.67202220', '-32.21624930', 62),
(13778, 'FLORIDA NEGRA', '780420000000029', '780420000000029', '-67.35490418', '-48.42013168', 63),
(13781, 'SUARDI', '820913666260000', '820913666260000', '-61.96168058', '-30.53614535', 64),
(13782, 'COLONIA SAN JOSE', '380946175010001', '380946175010001', '-65.39104516', '-23.40235447', 65),
(13787, 'LA TOMA', '740210042060000', '740210042060000', '-65.62269821', '-33.05443762', 66),
(13788, 'MAQUINCHAO', '620910266070000', '620910266070000', '-68.70034107', '-41.24751656', 67),
(13789, 'CALLE ANGOSTA', '063010301000003', '063010301000003', '-58.47736003', '-35.83441000', 68),
(13798, 'LAVALLE', '180910203030000', '180910203030000', '-59.18185701', '-29.02498125', 69),
(13803, 'ENRIQUE URIEN', '220980315020000', '220980315020000', '-60.52599075', '-27.55872515', 70),
(13807, 'CAMPO COLLA', '820703239000005', '820703239000005', '-61.39886860', '-31.76850300', 71),
(13811, 'EL MOJON', '141120000000030', '141120000000030', '-63.45358366', '-30.08849498', 72),
(13832, '3 DE MAYO', '540770308000001', '540770308000001', '-54.90115103', '-26.78501255', 73),
(13836, 'SALSACATE', '140770609040000', '140770609040000', '-65.09102606', '-31.31516167', 74),
(13840, 'PUEBLO VIEJO', '141820000000071', '141820000000071', '-62.83419037', '-32.84722519', 75),
(13883, 'LUCA', '140420322100000', '140420322100000', '-63.47625364', '-32.54019796', 76),
(13884, 'ENRIQUE CARBO', '300560184030000', '300560184030000', '-59.20894011', '-33.14784836', 77),
(13886, 'GENERAL RACEDO', '300219115110000', '300219115110000', '-60.40839123', '-31.98401645', 78),
(13887, 'CARCEL', '380986196000024', '380986196000024', '-65.53327179', '-23.81740761', 79),
(13893, 'LEONES', '140630567160000', '140630567160000', '-62.29991462', '-32.65839141', 80),
(13894, 'EL PALMAR', '220630189000062', '220630189000062', '-60.68620893', '-25.28986690', 81);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipio`
--

CREATE TABLE `municipio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipio`
--

INSERT INTO `municipio` (`id`, `nombre`, `id_departamento`) VALUES
(19, 'LA ESCONDIDA', 23),
(20, 'QUILINO', 24),
(21, 'CARRENLEUFU', 25),
(22, 'LAGO BLANCO', 26),
(23, 'HURLINGHAM', 27),
(24, 'GODOY', 28),
(25, 'VILLA MERCEDES', 29),
(26, 'BARRANCAS', 30),
(27, '28 DE JULIO', 31),
(28, 'NAUPA HUEN', 32),
(29, 'CHILCA JULIANA', 33),
(30, 'MALARGUE', 34),
(31, 'ESTANCIA DE GUADALUPE', 35),
(32, 'CORREA', 36),
(33, 'EL CHALTEN', 37),
(34, 'COLON', 38),
(35, 'BENITO JUAREZ', 39),
(36, 'LOS CONQUISTADORES', 40),
(37, 'GANCEDO', 41),
(38, 'LABORDE', 42),
(39, 'GENERAL GALARZA', 43),
(40, 'LA CALDERA', 44),
(41, 'FRAY MAMERTO ESQUIU', 45),
(42, 'OLAVARRIA', 46),
(43, 'COLONIA ITURRASPE', 47),
(44, 'AREQUITO', 48),
(45, 'SANTA VICTORIA OESTE', 49),
(46, 'RIO PIEDRAS', 50),
(47, 'SAN RAMIREZ', 51),
(48, 'PUELCHES', 52),
(49, 'GENERAL LAGOS', 53),
(50, 'CORZUELA', 54),
(51, 'LAS AGUADAS', 55),
(52, 'CAÑADON SECO', 56),
(53, 'SANAGASTA', 57),
(54, 'ALMIRANTE BROWN', 58),
(55, 'BELL VILLE', 42),
(56, 'CALETA OLIVIA', 56),
(57, 'NUEVA VIZCAYA', 59),
(58, 'JOSE C PAZ', 60),
(59, 'GARZA', 61),
(60, 'ROJAS', 62),
(61, 'PINTO', 63),
(62, 'AMBOY', 64),
(63, 'AREA SIN GOBIERNO', 65),
(64, 'SUARDI', 66),
(65, 'HUACALERA', 67),
(66, 'LA TOMA', 68),
(67, 'MAQUINCHAO', 69),
(68, 'GENERAL BELGRANO', 70),
(69, 'LAVALLE', 71),
(70, 'ENRIQUE URIEN', 72),
(71, 'SANTA CLARA DE BUENA VISTA', 73),
(72, 'AREA SIN GOBIERNO', 74),
(73, 'GARUHAPE', 75),
(74, 'SALSACATE', 76),
(75, 'AREA SIN GOBIERNO', 42),
(76, 'LUCA', 77),
(77, 'ENRIQUE CARBO', 78),
(78, 'EL CARMEN - ESTACION RACEDO', 79),
(79, 'TUMBAYA', 80),
(80, 'LEONES', 81),
(81, 'MIRAFLORES', 82),
(82, 'COLONIA TIROLESA', 83),
(83, 'LAS AVISPAS', 66),
(84, 'LABORDEBOY', 84),
(85, 'GENERAL GELLY', 28),
(86, 'EL TREBOL', 85),
(87, 'EL JARDIN', 86),
(88, 'LOZADA', 87),
(89, 'SALSIPUEDES', 83),
(90, 'SAN CARLOS', 88);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `provincia`
--

INSERT INTO `provincia` (`id`, `nombre`) VALUES
(497, 'BUENOS AIRES'),
(584, 'CATAMARCA'),
(487, 'CHACO'),
(495, 'CHUBUT'),
(491, 'CÓRDOBA'),
(758, 'CORRIENTES'),
(570, 'ENTRE RÍOS'),
(507, 'JUJUY'),
(669, 'LA PAMPA'),
(687, 'LA RIOJA'),
(520, 'MENDOZA'),
(792, 'MISIONES'),
(518, 'RÍO NEGRO'),
(575, 'SALTA'),
(503, 'SAN LUIS'),
(552, 'SANTA CRUZ'),
(500, 'SANTA FE'),
(519, 'SANTIAGO DEL ESTERO');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_provincia` (`id_provincia`);

--
-- Indices de la tabla `localidad`
--
ALTER TABLE `localidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_municipio_2` (`id_municipio`),
  ADD KEY `id_municipio` (`id_municipio`);

--
-- Indices de la tabla `municipio`
--
ALTER TABLE `municipio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_departamento` (`id_departamento`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `localidad`
--
ALTER TABLE `localidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13899;

--
-- AUTO_INCREMENT de la tabla `municipio`
--
ALTER TABLE `municipio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1313;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD CONSTRAINT `departamento_ibfk_1` FOREIGN KEY (`id_provincia`) REFERENCES `provincia` (`id`);

--
-- Filtros para la tabla `localidad`
--
ALTER TABLE `localidad`
  ADD CONSTRAINT `localidad_ibfk_1` FOREIGN KEY (`id_municipio`) REFERENCES `municipio` (`id`);

--
-- Filtros para la tabla `municipio`
--
ALTER TABLE `municipio`
  ADD CONSTRAINT `municipio_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamento` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
