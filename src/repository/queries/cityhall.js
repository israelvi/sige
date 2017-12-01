var cityhallQry = {};

cityhallQry.qryCandidatos = "SELECT c.anio AS anio, c.idCandidato AS idCandidato, c.campo AS campo, p.siglas AS siglas, pI.siglas AS siglasReal, pI.color AS color " +
    "FROM candidato c " +
    "INNER JOIN partido p ON p.IdPartido = c.IdPartidoPrincipal " +
    "INNER JOIN relcandidatopartido rcp ON rcp.IdCandidato = c.IdCandidato " +
    "INNER JOIN partido pI ON rcp.IdPartido = pI.IdPartido " +
    "WHERE p.siglas IN ('PRI', 'PAN', 'PRD', 'Morena') " +
    "ORDER BY p.IdPartido";

cityhallQry.qryElecAyunt = "SELECT eas.Municipio AS municipio, eas.Anio AS anio, {0}, SUM(eas.PadronElectoral) AS pe, SUM(eas.ListaNominal) AS ln, " +
    "SUM(eas.Nulos) AS nulos, SUM(eas.Total) AS total, SUM(eas.Abstencion) AS abstencion " +
    "FROM eleccionesayuntamientoseccion eas " +
    "WHERE eas.Anio = {1} AND eas.IdMunicipio = {2} GROUP BY eas.Municipio, eas.Anio ORDER BY eas.Anio ";

cityhallQry.qryCoverages = "SELECT c.Cobertura " +
    "FROM cobertura c " +
    "WHERE c.IdMunicipio = {0} ORDER BY c.IdCobertura DESC ";

cityhallQry.qrySelFieldCandidate = "SELECT cn.campo, p.color, p.siglas FROM candidato cn INNER JOIN partido p ON p.IdPartido = cn.IdPartidoPrincipal WHERE p.siglas = '{0}' AND cn.anio = '{1}' LIMIT 0, 1";

cityhallQry.qryEleAyuntSecc = "SELECT e.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR '|') AS Colonia, {0} AS SecVot FROM eleccionesayuntamientoseccion e INNER JOIN seccion s ON s.IdSeccion = e.IdSeccion INNER JOIN relseccioncolonia rsc ON s.IdSeccion = rsc.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE anio = {1} AND e.IdMunicipio = {2} GROUP BY e.IdSeccion HAVING e.IdSeccion ORDER BY {3} {4} LIMIT 0, {5}";

cityhallQry.qryAllCandidatos = "SELECT IdCandidato, Integrado, Anio, Campo FROM candidato ORDER BY Anio, IdCandidato";

cityhallQry.qrySecDiff = "SELECT s.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR ', ') AS Colonia, CandidatoA, CandidatoB, CandidatoC, CandidatoD, CandidatoE, CandidatoF, CandidatoG, CandidatoH, CandidatoI, CandidatoJ, ListaNominal, Nulos, Abstencion, Total FROM eleccionesayuntamientoseccion ea INNER JOIN seccion s ON s.IdSeccion = ea.IdSeccion INNER JOIN relseccioncolonia rsc ON s.IdSeccion = rsc.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia  WHERE anio = {0} AND ea.IdMunicipio = {1} GROUP BY ea.IdSeccion HAVING ea.IdSeccion ORDER BY {2} {3} LIMIT 0, {4}";

cityhallQry.qrySelElecDiffEqSec = "SELECT R2.* FROM (SELECT R1.*, CASE WHEN R1.Result2006 = R1.Result2009 AND R1.Result2006 = R1.Result2012 THEN 1 ELSE 0 END AS IsSame FROM (SELECT S.IdSeccion, S.Colonia, " +
    "E6.CandidatoB AS PRI6, E6.CandidatoA AS PAN6, E6.CandidatoC AS PRD6, E6.Total AS Total6, CASE WHEN E6.CandidatoB > E6.CandidatoA AND E6.CandidatoB > E6.CandidatoC THEN 1 WHEN E6.CandidatoA > E6.CandidatoC THEN 2 " +
    "ELSE 3 END AS Result2006, E9.CandidatoB AS PRI9, E9.CandidatoA AS PAN9, E9.CandidatoC AS PRD9, E9.Total AS Total9, CASE WHEN E9.CandidatoB > E9.CandidatoA AND E9.CandidatoB > E9.CandidatoC THEN 1 " +
    "WHEN E9.CandidatoA > E9.CandidatoC THEN 2 ELSE 3 END AS Result2009, E12.CandidatoB AS PRI12, E12.CandidatoA AS PAN12, E12.CandidatoD AS PRD12, E12.Total AS Total12, " +
    "CASE WHEN E12.CandidatoB > E12.CandidatoA AND E12.CandidatoB > E12.CandidatoD THEN 1 WHEN E12.CandidatoA > E12.CandidatoD THEN 2 ELSE 3 END AS Result2012, E6.Total + E9.Total + E12.Total AS Total " +
    "FROM (SELECT e.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR ', ') AS Colonia FROM eleccionesayuntamientoseccion e INNER JOIN relseccioncolonia rsc " + 
    "ON rsc.IdSeccion = e.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE e.IdMunicipio = {0} GROUP BY e.IdSeccion HAVING e.IdSeccion) S INNER JOIN eleccionesayuntamientoseccion E6 ON E6.IdSeccion = S.IdSeccion AND E6.Anio = 2006 " +
    "INNER JOIN eleccionesayuntamientoseccion E9 ON E9.IdSeccion = S.IdSeccion AND E9.Anio = 2009 INNER JOIN eleccionesayuntamientoseccion E12 ON E12.IdSeccion = S.IdSeccion AND E12.Anio = 2012 ) R1 " +
    "WHERE (R1.Result2006 = {1} OR R1.Result2009 = {1} OR R1.Result2012 = {1}) ) R2 WHERE R2.IsSame = {2} ORDER BY Total DESC LIMIT 0, {3}";

cityhallQry.qrySecSearchBy = "SELECT DISTINCT e.IdSeccion FROM eleccionesayuntamientoseccion e WHERE e.IdMunicipio = {0} AND e.IdSeccion LIKE '%{1}%'";

cityhallQry.qryColSearchBy = "SELECT DISTINCT c.Colonia FROM eleccionesayuntamientoseccion e INNER JOIN relseccioncolonia rsc ON e.IdSeccion = rsc.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE e.IdMunicipio = {0} AND c.Colonia LIKE '%{1}%'";

cityhallQry.qryAddBySec = "SELECT R2.* FROM (SELECT R1.*, CASE WHEN R1.Result2006 = R1.Result2009 AND R1.Result2006 = R1.Result2012 THEN 1 ELSE 0 END AS IsSame FROM (SELECT S.IdSeccion, S.Colonia, " +
    "E6.CandidatoB AS PRI6, E6.CandidatoA AS PAN6, E6.CandidatoC AS PRD6, E6.Total AS Total6, CASE WHEN E6.CandidatoB > E6.CandidatoA AND E6.CandidatoB > E6.CandidatoC THEN 1 WHEN E6.CandidatoA > E6.CandidatoC THEN 2 " +
    "ELSE 3 END AS Result2006, E9.CandidatoB AS PRI9, E9.CandidatoA AS PAN9, E9.CandidatoC AS PRD9, E9.Total AS Total9, CASE WHEN E9.CandidatoB > E9.CandidatoA AND E9.CandidatoB > E9.CandidatoC THEN 1 " +
    "WHEN E9.CandidatoA > E9.CandidatoC THEN 2 ELSE 3 END AS Result2009, E12.CandidatoB AS PRI12, E12.CandidatoA AS PAN12, E12.CandidatoD AS PRD12, E12.Total AS Total12, " +
    "CASE WHEN E12.CandidatoB > E12.CandidatoA AND E12.CandidatoB > E12.CandidatoD THEN 1 WHEN E12.CandidatoA > E12.CandidatoD THEN 2 ELSE 3 END AS Result2012, E6.Total + E9.Total + E12.Total AS Total " +
    "FROM (SELECT e.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR ', ') AS Colonia FROM eleccionesayuntamientoseccion e INNER JOIN relseccioncolonia rsc " + 
    "ON rsc.IdSeccion = e.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE e.IdMunicipio = {0} GROUP BY e.IdSeccion HAVING e.IdSeccion) S INNER JOIN eleccionesayuntamientoseccion E6 ON E6.IdSeccion = S.IdSeccion AND E6.Anio = 2006 " +
    "INNER JOIN eleccionesayuntamientoseccion E9 ON E9.IdSeccion = S.IdSeccion AND E9.Anio = 2009 INNER JOIN eleccionesayuntamientoseccion E12 ON E12.IdSeccion = S.IdSeccion AND E12.Anio = 2012 ) R1 " +
    ") R2 WHERE IdSeccion = {1} ORDER BY Total DESC";

cityhallQry.qryAddByLoc = "SELECT R2.* FROM (SELECT R1.*, CASE WHEN R1.Result2006 = R1.Result2009 AND R1.Result2006 = R1.Result2012 THEN 1 ELSE 0 END AS IsSame FROM (SELECT S.IdSeccion, S.Colonia, " +
    "E6.CandidatoB AS PRI6, E6.CandidatoA AS PAN6, E6.CandidatoC AS PRD6, E6.Total AS Total6, CASE WHEN E6.CandidatoB > E6.CandidatoA AND E6.CandidatoB > E6.CandidatoC THEN 1 WHEN E6.CandidatoA > E6.CandidatoC THEN 2 " +
    "ELSE 3 END AS Result2006, E9.CandidatoB AS PRI9, E9.CandidatoA AS PAN9, E9.CandidatoC AS PRD9, E9.Total AS Total9, CASE WHEN E9.CandidatoB > E9.CandidatoA AND E9.CandidatoB > E9.CandidatoC THEN 1 " +
    "WHEN E9.CandidatoA > E9.CandidatoC THEN 2 ELSE 3 END AS Result2009, E12.CandidatoB AS PRI12, E12.CandidatoA AS PAN12, E12.CandidatoD AS PRD12, E12.Total AS Total12, " +
    "CASE WHEN E12.CandidatoB > E12.CandidatoA AND E12.CandidatoB > E12.CandidatoD THEN 1 WHEN E12.CandidatoA > E12.CandidatoD THEN 2 ELSE 3 END AS Result2012, E6.Total + E9.Total + E12.Total AS Total " +
    "FROM (SELECT e.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR ', ') AS Colonia FROM eleccionesayuntamientoseccion e INNER JOIN relseccioncolonia rsc " + 
    "ON rsc.IdSeccion = e.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE e.IdMunicipio = {0} AND e.IdSeccion IN (SELECT DISTINCT rscI.IdSeccion FROM relseccioncolonia rscI INNER JOIN Colonia c ON c.IdColonia = rscI.IdColonia WHERE c.Colonia = '{1}' ) GROUP BY e.IdSeccion HAVING e.IdSeccion) S INNER JOIN eleccionesayuntamientoseccion E6 ON E6.IdSeccion = S.IdSeccion AND E6.Anio = 2006 " +
    "INNER JOIN eleccionesayuntamientoseccion E9 ON E9.IdSeccion = S.IdSeccion AND E9.Anio = 2009 INNER JOIN eleccionesayuntamientoseccion E12 ON E12.IdSeccion = S.IdSeccion AND E12.Anio = 2012 ) R1 " +
    ") R2 ORDER BY Total DESC";

cityhallQry.qrySelProjectionParams = "SELECT IdMunicipio, KeyParam, ValueParam FROM projectionparams WHERE IdMunicipio = {0} AND ProjectionType = {1}";

cityhallQry.qryProjectionByPolling = "SELECT S.IdSeccion, S.Colonia, c.Casilla, eac.IdMunicipio, eac.Anio, eac.PadronElectoral, eac.ListaNominal," + 
"eac.CandidatoA AS PAN, eac.CandidatoB AS PRI, eac.CandidatoC AS PRD, eac.NoRegistrados, eac.Nulos, eac.Total, eac.Abstencion " +
"FROM(SELECT e.IdSeccion, GROUP_CONCAT(DISTINCT c.Colonia SEPARATOR ', ') AS Colonia FROM eleccionesayuntamientoseccion e INNER JOIN relseccioncolonia rsc " +
"ON rsc.IdSeccion = e.IdSeccion INNER JOIN colonia c ON c.IdColonia = rsc.IdColonia WHERE e.Anio = {0} AND e.IdMunicipio = {1} GROUP BY e.IdSeccion HAVING e.IdSeccion) S " +
"INNER JOIN casilla c ON c.IdSeccion = S.IdSeccion " +
"INNER JOIN eleccionesayuntamientocasilla eac ON eac.IdCasilla = c.IdCasilla " +
"WHERE eac.Anio = {0} AND eac.IdMunicipio = {1} ORDER BY S.IdSeccion, c.Casilla ";


module.exports = cityhallQry;