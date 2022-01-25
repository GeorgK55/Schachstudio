DROP TABLE IF EXISTS T_ThemenAufgaben;
DROP TABLE IF EXISTS T_Zuege;
DROP TABLE IF EXISTS T_Aufgaben;
DROP TABLE IF EXISTS T_Quellen;
DROP TABLE IF EXISTS T_Themen;

--delete from T_ThemenAufgaben;
--ALTER TABLE T_ThemenAufgaben AUTO_INCREMENT=0;

delete from T_Zuege;
ALTER TABLE T_Zuege AUTO_INCREMENT=0;

delete from T_Aufgaben;
ALTER TABLE T_Aufgaben AUTO_INCREMENT=0;

--delete from T_Themen;
--ALTER TABLE T_Zuege AUTO_INCREMENT=0;

--SELECT `AufgabeID`,`PreMoveId`,`CurMoveIndex`,`CurMoveId`,`FEN`,`ZugLevel`,`ZugNummer`,`ZugFarbe`,`ZugKurz`,`ZugStockfish` FROM `V_AufgabenZuegeWichtig` WHERE `AufgabeID` = 5

CREATE TABLE T_Zuege (
    Id                 INT          NOT NULL AUTO_INCREMENT,
    AufgabeID          INT          DEFAULT NULL,
    CurMoveIndex       INT          DEFAULT 0 NULL,
    CurMoveId          varchar(16)  DEFAULT 'M_0' NULL,
    PreMoveId          varchar(16)  DEFAULT 'M_0' NULL,
    FEN                varchar(128) DEFAULT NULL,
    NAG                varchar(16)  DEFAULT NULL,
    ZugNummer          INT          DEFAULT 0 NULL,
    ZugLevel           INT          DEFAULT 0 NULL,
    ZugFarbe           varchar(8)   DEFAULT NULL,
    ZugOriginal        varchar(8)   DEFAULT NULL,
    ZugFigur           CHAR (1)     DEFAULT NULL,
    ZugVon             CHAR (2)     DEFAULT NULL,
    ZugNach            CHAR (2)     DEFAULT NULL,
    ZugKurz            CHAR (8)     DEFAULT NULL,
    ZugLang            CHAR (8)     DEFAULT NULL,
    ZugStockfish       CHAR (8)     DEFAULT NULL,
    ZugAktion          CHAR (1)     DEFAULT NULL,
    ZugZeichen         CHAR (2)     DEFAULT NULL,
    ZugUmwandlung      varchar(2)   DEFAULT NULL,
    Hinweistext        varchar(512) DEFAULT NULL,
    Hinweispfeil       varchar(512) DEFAULT NULL,
    Ab                 DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY       (Id)
);

CREATE TABLE T_Aufgaben ( 
    Id              INT           NOT NULL AUTO_INCREMENT,
    Kurztext        varchar(63)   NOT NULL,
    Langtext        varchar(511)  DEFAULT NULL,
    Quelle          varchar(63)   DEFAULT NULL,
    Quelledetail    varchar(511)  DEFAULT NULL,
    ImportQuelle    varchar(15)   NOT NULL,
    Ab              datetime      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    AmZug           varchar(15)   DEFAULT NULL,
    FEN             varchar(127)  NOT NULL,
    Scope           varchar(15)   DEFAULT NULL,
    Skill           varchar(15)   DEFAULT NULL,
    lichess_studie  varchar(15)   DEFAULT NULL,
    lichess_kapitel varchar(15)   DEFAULT NULL,
    PGN             varchar(4096) DEFAULT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE T_Quellen (
    Id   INT         NOT NULL AUTO_INCREMENT,
    Text varchar(63) DEFAULT NULL,
    Ab   DATETIME    DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE T_Themen (
    Id        INT         NOT NULL AUTO_INCREMENT,
    Level     INT         NOT NULL DEFAULT 0,
    Father    varchar(63) DEFAULT NULL,
    Thematext varchar(63) DEFAULT NULL,
    Ab         DATETIME   DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (Id)
);

INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '0', NULL, 'Eröffnungen');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '0', NULL, 'Taktik');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '0', NULL, 'Endspiele');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '0', NULL, 'Sonstiges');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '1', 'Endspiele', 'Durchbruch');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '1', 'Endspiele', 'Bauernendspiele');
INSERT INTO T_Themen (Id, Level, Father, Thematext) VALUES (NULL, '1', 'Endspiele', 'Quadratregel');


CREATE TABLE T_ThemenAufgaben (
    Id         INT           NOT NULL AUTO_INCREMENT,
    ThemenID   INT           NOT NULL,
    AufgabenID INT           NOT NULL,
    Ab         DATETIME      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY FK_Themen(ThemenID)   REFERENCES T_Themen   (Id),
    FOREIGN KEY FK_Aufgaben(AufgabenID) REFERENCES T_Aufgaben (Id)
);


DROP VIEW IF EXISTS V_AufgabenZuege;  
CREATE VIEW V_AufgabenZuege
	AS SELECT T_Aufgaben.Kurztext, 
			  T_Aufgaben.Langtext, 
			  T_Aufgaben.Quelle, 
			  T_Aufgaben.Quelledetail, 
			  T_Aufgaben.ImportQuelle, 
			  T_Aufgaben.Ab, 
			  T_Aufgaben.Scope, 
			  T_Aufgaben.FEN as FEN_Aufgabe, 
			  T_Aufgaben.Skill, 
			  T_Aufgaben.AmZug, 
			  T_Zuege.AufgabeID, 
			  T_Zuege.CurMoveIndex, 
			  T_Zuege.CurMoveId, 
			  T_Zuege.PreMoveId, 
			  T_Zuege.FEN, 
			  T_Zuege.NAG, 
			  T_Zuege.ZugNummer, 
			  T_Zuege.ZugLevel, 
			  T_Zuege.ZugFarbe, 
			  T_Zuege.ZugOriginal,
			  T_Zuege.ZugFigur,
			  T_Zuege.ZugVon,
			  T_Zuege.ZugNach,
			  T_Zuege.ZugKurz,
			  T_Zuege.ZugLang,
			  T_Zuege.ZugStockfish,
			  T_Zuege.ZugAktion,
			  T_Zuege.ZugZeichen,
			  T_Zuege.ZugUmwandlung,
			  T_Zuege.Hinweistext, 
			  T_Zuege.Hinweispfeil 
FROM   T_Aufgaben INNER JOIN
           T_Zuege ON T_Aufgaben.Id = T_Zuege.AufgabeID;
DROP VIEW IF EXISTS V_AufgabenZuegeWichtig;  
CREATE VIEW V_AufgabenZuegeWichtig
	AS SELECT T_Aufgaben.Kurztext, 
			  T_Aufgaben.FEN as FEN_Aufgabe, 
			  T_Aufgaben.AmZug, 
			  T_Zuege.AufgabeID, 
			  T_Zuege.CurMoveIndex, 
			  T_Zuege.CurMoveId, 
			  T_Zuege.PreMoveId, 
			  T_Zuege.FEN, 
			  T_Zuege.ZugNummer, 
			  T_Zuege.ZugLevel, 
			  T_Zuege.ZugFarbe, 
			  T_Zuege.ZugOriginal,
			  T_Zuege.ZugFigur,
			  T_Zuege.ZugVon,
			  T_Zuege.ZugNach,
			  T_Zuege.ZugKurz,
			  T_Zuege.ZugLang,
			  T_Zuege.ZugStockfish,
			  T_Zuege.ZugAktion,
			  T_Zuege.ZugZeichen,
			  T_Zuege.ZugUmwandlung,
			  T_Zuege.Hinweistext, 
			  T_Zuege.Hinweispfeil 
FROM   T_Aufgaben INNER JOIN
           T_Zuege ON T_Aufgaben.Id = T_Zuege.AufgabeID;

DROP VIEW IF EXISTS V_ThemenAufgaben;            
CREATE VIEW V_ThemenAufgaben
	AS SELECT T_Themen.Id as Themen_ID, 
	          T_Aufgaben.Id as Aufgaben_ID, 
			  T_Themen.Thematext, 
			  T_Aufgaben.Kurztext, 
			  T_Aufgaben.Quelle, 
			  T_Aufgaben.ImportQuelle, 
			  lichess_studie, 
			  lichess_kapitel 
FROM   T_Themen INNER JOIN
           T_ThemenAufgaben ON T_Themen.Id = T_ThemenAufgaben.ThemenID RIGHT OUTER JOIN
           T_Aufgaben ON T_ThemenAufgaben.AufgabenID = T_Aufgaben.Id;

SELECT Id,  
    ZugLevel as Level, 
    ZugNummer as ZugNr, 
    PreMoveId, 
    CurMoveId, 
    CurMoveIndex, 
    ZugOriginal as Original, 
    ZugFarbe as Farbe, 
    FEN, 
    NAG, 
    ZugFigur as Figur, 
    ZugVon as Von, 
    ZugNach as Nach, 
    ZugKurz as Kurz, 
    ZugLang as Lang, 
    ZugStockfish as ZugSF, 
    ZugAktion as Aktion, 
    ZugZeichen as Zeichen, 
    ZugUmwandlung as Umw
FROM T_Zuege;