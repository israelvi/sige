INSERT INTO sige.eleccionesayuntamientoseccion
(IdSeccion, IdMunicipio, IdDistritoLocal, IdDistritoFederal, DistritoCabecera, Municipio
, Anio, PadronElectoral, ListaNominal, IdCandidatoA, CandidatoA
, IdCandidatoB, CandidatoB, IdCandidatoC, CandidatoC, IdCandidatoD, CandidatoD
, IdCandidatoE, CandidatoE, IdCandidatoF, CandidatoF, IdCandidatoG, CandidatoG
, IdCandidatoH, CandidatoH, IdCandidatoI, CandidatoI, IdCandidatoJ, CandidatoJ
, IdCandidatoK, CandidatoK, IdCandidatoL, CandidatoL, IdCandidatoM, CandidatoM
, IdCandidatoN, CandidatoN, IdCandidatoO, CandidatoO, IdCandidatoP, CandidatoP
, CandidatosNoRegistrados, Nulos, Total, Abstencion)
SELECT 
	Vo.Seccion,
	105,
	Ea.IdDistritoLocal,
	Ea.IdDistritoFederal,
	Ea.DistritoCabecera,
	Ea.Municipio,
	2015,
	SUM(IFNULL(Vo.Ln, 0)),
	SUM(IFNULL(Vo.Ln, 0)),
	20,
	SUM(IFNULL(Vo.PAN, 0)),
	21,
	SUM(IFNULL(Vo.PRI, 0)),
	22,
	SUM(IFNULL(Vo.PRD, 0)),
	23,
	SUM(IFNULL(Vo.PT, 0)),
	24,
	SUM(IFNULL(Vo.PVEM, 0)),
	25,
	SUM(IFNULL(Vo.MC, 0)),
	26,
	SUM(IFNULL(Vo.NA, 0)),
	27,
	SUM(IFNULL(Vo.MORENA, 0)),
	28,
	SUM(IFNULL(Vo.PH, 0)),
	29,
	SUM(IFNULL(Vo.PES, 0)),
	30,
	SUM(IFNULL(Vo.PFD, 0)),
	31,
	SUM(IFNULL(Vo.`PRI PVEM NA`, 0)),
	32,
	SUM(IFNULL(Vo.`PRI PVEM`, 0)),
	33,
	SUM(IFNULL(Vo.`PRI NA`, 0)),
	34,
	SUM(IFNULL(Vo.`PVEM NA`, 0)),
	35,
	SUM(IFNULL(Vo.`PAN PT`, 0)),
	SUM(IFNULL(Vo.`No Registrados`, 0)),
	SUM(IFNULL(Vo.Nulos, 0)),
	SUM(IFNULL(Vo.Total, 0)),
	SUM(IFNULL(Vo.Ln, 0) - IFNULL(Vo.Total, 0))
FROM elecciones.votaciones2015 Vo 
INNER JOIN sige.eleccionesayuntamientoseccion Ea ON Ea.IdSeccion = Vo.Seccion AND Ea.Anio = 2012 AND Ea.IdMunicipio = 105
WHERE Vo.Municipio = 105 -- AND CasillaNombre IS NULL -- Seccion IN (4799, 5013);
GROUP BY Vo.Seccion, Ea.IdDistritoLocal,
	Ea.IdDistritoFederal,
	Ea.DistritoCabecera,
	Ea.Municipio