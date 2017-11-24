---SELECT Seccion, Casilla FROM Votaciones2015 WHERE Municipio = 105
--SELECT * FROM Votaciones2015 WHERE Municipio = 105

DECLARE 
	@seccion float, 
	@casilla nvarchar(250), 
	@casilla_tmp nvarchar(250), 
	@ln float,  
    @num_secc float, 
    @num_casilla float,
	@conteo float
	


DECLARE seccion_cursor CURSOR FOR   
SELECT 
	Ay.Seccion, Ay.LN, COUNT(*) AS NumSeccion, CAST(Ay.LN/COUNT(*) AS INT) AS NumCasilla
	FROM Ayunta2015 Ay
INNER JOIN Votaciones2015 Vo ON Vo.Seccion = Ay.Seccion
WHERE Ay.Seccion IS NOT NULL
GROUP BY Ay.Seccion, Ay.LN  

OPEN seccion_cursor  

FETCH NEXT FROM seccion_cursor   
INTO @seccion, @ln, @num_secc, @num_casilla   

WHILE @@FETCH_STATUS = 0  
BEGIN  

	SET @conteo = 0

    DECLARE casilla_cursor CURSOR FOR   
    SELECT Casilla FROM Votaciones2015 WHERE Municipio = 105 AND Seccion = @seccion
    OPEN casilla_cursor  
    FETCH NEXT FROM casilla_cursor 
		INTO @casilla  

    WHILE @@FETCH_STATUS = 0  
    BEGIN  
		SET @casilla_tmp = @casilla
        FETCH NEXT FROM casilla_cursor INTO @casilla  
        
		IF @@FETCH_STATUS!=0
		BEGIN
			UPDATE Votaciones2015 SET LN = @ln - @conteo WHERE  Municipio = 105 AND Seccion = @seccion AND Casilla = @casilla_tmp
		END
		ELSE
		BEGIN
			UPDATE Votaciones2015 SET LN = @num_casilla WHERE  Municipio = 105 AND Seccion = @seccion AND Casilla = @casilla_tmp
			SET @conteo = @conteo + @num_casilla
		END		
	END  

    CLOSE casilla_cursor  
    DEALLOCATE casilla_cursor  
    FETCH NEXT FROM seccion_cursor   
	INTO @seccion, @ln, @num_secc, @num_casilla    
END   
CLOSE seccion_cursor;  
DEALLOCATE seccion_cursor;  