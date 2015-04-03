CREATE TABLE [team](
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL UNIQUE
);

CREATE TABLE "employee" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "name" TEXT NOT NULL,
  "surname" TEXT NOT NULL,
  "work_start" DATETIME,
  "work_end" DATETIME,
  "team_id" INTEGER NOT NULL,
  FOREIGN KEY ("team_id") REFERENCES [team]("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE [day_type](
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "name" TEXT NOT NULL
  );

CREATE TABLE [employee_day](
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "employee_id" INTEGER NOT NULL REFERENCES  [employee]("id"),
  "date" DATETIME NOT NULL,
  "day_type_id" INTEGER NOT NULL REFERENCES  [day_type]("id")
);

CREATE TABLE [user](
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  "name" TEXT NOT NULL,
  "surname" TEXT NOT NULL,
  "password" TEXT,
  "team_id" INTEGER NOT NULL REFERENCES  [team]("id"),
  "is_super" BOOLEAN NOT NULL DEFAULT 0 CHECK (is_super IN (0,1))
);

CREATE TABLE [public_holiday](
  "date" DATETIME NOT NULL PRIMARY KEY UNIQUE,
  "description" TEXT
);
