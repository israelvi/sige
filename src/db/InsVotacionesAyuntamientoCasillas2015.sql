INSERT INTO sige.eleccionesayuntamientocasilla
(IdCasilla, IdMunicipio, Anio, PadronElectoral, ListaNominal, IdCandidatoA, CandidatoA
, IdCandidatoB, CandidatoB, IdCandidatoC, CandidatoC, IdCandidatoD, CandidatoD
, IdCandidatoE, CandidatoE, IdCandidatoF, CandidatoF, IdCandidatoG, CandidatoG
, IdCandidatoH, CandidatoH, IdCandidatoI, CandidatoI, IdCandidatoJ, CandidatoJ
, IdCandidatoK, CandidatoK, IdCandidatoL, CandidatoL, IdCandidatoM, CandidatoM
, IdCandidatoN, CandidatoN, IdCandidatoO, CandidatoO, IdCandidatoP, CandidatoP
, NoRegistrados, Nulos, Total, Abstencion)
SELECT 
	Ca.IdCasilla,
	105,
	2015,
	Vo.Ln,
	Vo.Ln,
	20,
	Vo.PAN,
	21,
	Vo.PRI,
	22,
	Vo.PRD,
	23,
	Vo.PT,
	24,
	Vo.PVEM,
	25,
	Vo.MC,
	26,
	Vo.NA,
	27,
	Vo.MORENA,
	28,
	Vo.PH,
	29,
	Vo.PES,
	30,
	Vo.PFD,
	31,
	Vo.`PRI PVEM NA`,
	32,
	Vo.`PRI PVEM`,
	33,
	Vo.`PRI NA`,
	34,
	Vo.`PVEM NA`,
	35,
	Vo.`PAN PT`,
	Vo.`No Registrados`,
	Vo.Nulos,
	Vo.Total,
	Vo.Ln - Vo.Total
FROM elecciones.votaciones2015 Vo 
INNER JOIN sige.casilla Ca ON Ca.IdSeccion = Vo.Seccion AND Ca.Casilla = Vo.CasillaNombre

WHERE Municipio = 105 -- AND CasillaNombre IS NULL -- Seccion IN (4799, 5013);
ORDER BY IdCasilla
-- UPDATE elecciones.votaciones2015 SET CasillaNombre = 'ESPECIAL 1' WHERE Casilla = 'S1' AND Municipio = 105;

-- SET SQL_SAFE_UPDATES = 0;