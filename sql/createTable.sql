DROP TABLE IF EXISTS T_NutzerLog;
DROP TABLE IF EXISTS T_ThemenAufgaben;
DROP TABLE IF EXISTS T_Zuege;
DROP TABLE IF EXISTS T_Aufgaben;
DROP TABLE IF EXISTS T_Quellen;
DROP TABLE IF EXISTS T_Themen;
DROP TABLE IF EXISTS T_SystemValues;
DROP TABLE IF EXISTS T_NAG;

# delete from T_NutzerLog;
# ALTER TABLE T_NutzerLog AUTO_INCREMENT=0;

# delete from T_ThemenAufgaben;
# ALTER TABLE T_ThemenAufgaben AUTO_INCREMENT=0;

# delete from T_Zuege;
# ALTER TABLE T_Zuege AUTO_INCREMENT=0;

# delete from T_Aufgaben;
# ALTER TABLE T_Aufgaben AUTO_INCREMENT=0;

# delete from T_Themen;
# ALTER TABLE T_Themen AUTO_INCREMENT=0;

# delete from T_NAG;
# ALTER TABLE T_NAG AUTO_INCREMENT=0;

CREATE TABLE T_NutzerLog (
    Id              INT         NOT NULL AUTO_INCREMENT,
    Benutzer       varchar(63)  NOT NULL,
    Betriebssystem varchar(63)  NOT NULL,
    Browsername    varchar(63)  NOT NULL,
    Browserdetails varchar(511) NOT NULL,
    Cookies        tinyint      NOT NULL,
    Besuchszeit    datetime     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Orientation    varchar(63)  NOT NULL,
    Fensterhoehe   INT          NOT NULL,
    Fensterbreite  INT          NOT NULL,
		PixelRatio     INT          NOT NULL,
		pixelDepth     INT          NOT NULL,
		colorDepth     INT          NOT NULL,
    Aktion         varchar(15)  NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE T_Aufgaben (
    Id										INT           NOT NULL AUTO_INCREMENT,
    Kurztext							varchar(63)   NOT NULL,
    Langtext							varchar(511)  DEFAULT NULL,
    Quelle								varchar(63)   DEFAULT NULL,
    Quelledetail					varchar(511)  DEFAULT NULL,
    ImportQuelle					varchar(31)   NOT NULL,
		Annotator							varchar(63)   DEFAULT NULL,
		WeissName							varchar(63)   DEFAULT NULL,
		SchwarzName						varchar(63)   DEFAULT NULL,
    Ab										datetime      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Datum									datetime      DEFAULT CURRENT_TIMESTAMP NULL,
    AmZug									varchar(15)   NOT NULL,
    FEN										varchar(127)  NOT NULL,
    Scope									varchar(15)   DEFAULT NULL,
    Skill									varchar(15)   DEFAULT NULL,
    lichess_studie_id			varchar(31)   DEFAULT NULL,
    lichess_kapitel_id		varchar(31)   DEFAULT NULL,
    PGN										varchar(8192) NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE T_Zuege (
    Id                 INT          NOT NULL AUTO_INCREMENT,
    AufgabeID          INT          NOT NULL,
    CurMoveIndex       INT          DEFAULT 0 NOT NULL,
    CurMoveId          varchar(16)  DEFAULT 'M_0' NOT NULL,
    PreMoveId          varchar(16)  DEFAULT 'M_0' NOT NULL,
    ZugNummer          INT          NOT NULL,
    ZugLevel           INT          NOT NULL,
    ZugFarbe           varchar(8)   NOT NULL,
    ZugOriginal        varchar(8)   NOT NULL,
    ZugFigur           CHAR (1)     DEFAULT NULL,
    ZugVon             CHAR (2)     DEFAULT NULL,
    ZugNach            CHAR (2)     DEFAULT NULL,
    ZugKurz            CHAR (8)     DEFAULT NULL,
    ZugLang            CHAR (8)     DEFAULT NULL,
    ZugStockfish       CHAR (8)     DEFAULT NULL,
    ZugAktion          CHAR (1)     DEFAULT NULL,
    ZugStart           CHAR (1)     DEFAULT NULL,
    ZugZeichen         CHAR (2)     DEFAULT NULL,
    ZugUmwandlung      varchar(2)   DEFAULT NULL,
    FEN                varchar(128) NOT NULL,
    NAGMove            varchar(16)  DEFAULT NULL,
    NAGSingle          varchar(32)  DEFAULT NULL,
    NAGNotation        varchar(32)  DEFAULT NULL,
    Hinweistext        varchar(512) DEFAULT NULL,
    Hinweispfeil       varchar(512) DEFAULT NULL,
    MoveState          varchar(16)  DEFAULT 'R' NOT NULL,
    MoveNode           varchar(16)  DEFAULT NULL,
    Ab                 DATETIME     DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY       (Id),
		CONSTRAINT FK_Aufgabe   FOREIGN KEY (AufgabeID)   REFERENCES T_Aufgaben(Id) ON DELETE CASCADE
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
    Parent    INT         DEFAULT NULL,
    Thematext varchar(63) NOT NULL,
    Ab        DATETIME    DEFAULT CURRENT_TIMESTAMP NOT NULL,
		UNIQUE KEY UK_Themen (Level , Thematext),
  	PRIMARY KEY (Id)
);

INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '0', NULL, 'Eröffnungen');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '0', NULL, 'Taktik');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '0', NULL, 'Endspiele');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '0', NULL, 'Sonstiges');
ALTER TABLE T_Themen AUTO_INCREMENT = 10;
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 3, 'Durchbruch');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 3, 'Bauernendspiele');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 3, 'Quadratregel');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 4, 'Varianten');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 13, 'Gegner');
INSERT INTO T_Themen (Id, Level, Parent, Thematext) VALUES (NULL, '1', 13, 'Spieler');
# ALTER TABLE `T_Themen` CHANGE `Id` `Id` INT(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE T_ThemenAufgaben (
    Id         INT           NOT NULL AUTO_INCREMENT,
    ThemenID   int           NOT NULL,
    AufgabenID INT           NOT NULL,
    Ab         DATETIME      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (Id),
		UNIQUE KEY UK_ThemenAufgaben (ThemenID , AufgabenID),
    CONSTRAINT FK_Themen   FOREIGN KEY (ThemenID)   REFERENCES T_Themen(Id),
    CONSTRAINT FK_Aufgaben FOREIGN KEY (AufgabenID) REFERENCES T_Aufgaben(Id)
);

CREATE TABLE T_SystemValues (
    Id              INT           NOT NULL AUTO_INCREMENT,
    SystemKey       varchar(63)   NOT NULL,
    SystemValue     varchar(63)   DEFAULT NULL,
    PRIMARY KEY (Id)
);

INSERT INTO T_SystemValues (SystemKey, SystemValue) VALUES ('Lastupdate', '25.5.2022');
INSERT INTO T_SystemValues (SystemKey, SystemValue) VALUES ('VisitorCounter', '100');

CREATE TABLE T_NAG (
    Id              INT           NOT NULL AUTO_INCREMENT,
		DollarIndex			varchar(8)    NOT NULL,
		Bedeutung				varchar(128)  NOT NULL,
		Symbolzeichen		varchar(8),
		Symbolname			varchar(32),
		Unicode					varchar(32),
		html						varchar(32),
    PRIMARY KEY (Id)
);

DROP VIEW IF EXISTS V_AufgabenZuege;
CREATE VIEW V_AufgabenZuege
	AS SELECT T_Aufgaben.Kurztext,
			  T_Aufgaben.Langtext,
			  T_Aufgaben.Quelle,
			  T_Aufgaben.Quelledetail,
			  T_Aufgaben.ImportQuelle,
			  T_Aufgaben.Annotator,
			  T_Aufgaben.WeissName,
			  T_Aufgaben.SchwarzName,
			  T_Aufgaben.Ab,
			  T_Aufgaben.Datum,
			  T_Aufgaben.AmZug,
			  T_Aufgaben.FEN as FEN_Aufgabe,
			  T_Aufgaben.Scope,
			  T_Aufgaben.Skill,
			  T_Aufgaben.lichess_studie_id,
			  T_Aufgaben.lichess_kapitel_id,
			  T_Zuege.AufgabeID,
			  T_Zuege.CurMoveIndex,
			  T_Zuege.CurMoveId,
			  T_Zuege.PreMoveId,
			  T_Zuege.FEN,
			  T_Zuege.NAGMove,
			  T_Zuege.NAGSingle,
			  T_Zuege.NAGNotation,
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
	AS SELECT T_Themen.id as Themen_ID,
	          T_Aufgaben.Id as Aufgaben_ID,
			  T_Themen.thematext,
			  T_Aufgaben.Kurztext,
			  T_Aufgaben.Quelle,
			  T_Aufgaben.ImportQuelle,
			  T_Aufgaben.lichess_studie_id,
			  T_Aufgaben.lichess_kapitel_id
FROM   T_Themen INNER JOIN
           T_ThemenAufgaben ON T_Themen.id = T_ThemenAufgaben.ThemenID RIGHT OUTER JOIN
           T_Aufgaben ON T_ThemenAufgaben.AufgabenID = T_Aufgaben.Id;

DROP VIEW IF EXISTS V_ZuegeWichtig;
CREATE VIEW V_ZuegeWichtig
	AS SELECT
    AufgabeID,
    CurMoveId,
    PreMoveId,
    NAGMove,
    NAGSingle,
    NAGNotation,
    ZugNummer,
    ZugLevel,
    ZugFarbe,
    ZugOriginal,
    Hinweistext,
    Hinweispfeil
FROM T_Zuege;
