CREATE DATABASE my_DB;

CREATE TABLE Users (
	id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	login VARCHAR ( 50 ) CHECK(login !='') NOT NULL,
	password VARCHAR ( 50 ) CHECK(password !='' AND password ~ '^(?=.*[a-zA-Z])(?=.*[0-9])') NOT NULL,
	age INT CHECK (age >= 4 AND age <= 130) NOT NULL,	
	"isDeleted" BOOL NOT NULL
);

INSERT INTO Users (login, password, age, "isDeleted") VALUES ('logexamp1', 'password1', 30, false);
INSERT INTO Users (login, password, age, "isDeleted") VALUES ('logb', 'password2', 40, false);
INSERT INTO Users (login, password, age, "isDeleted") VALUES ('lin3', 'password3', 50, false);
INSERT INTO Users (login, password, age, "isDeleted") VALUES ('test4', 'password4', 60, true);
INSERT INTO Users (login, password, age, "isDeleted") VALUES ('loga', 'password5', 70, false);

CREATE TABLE Groups (
	id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	name VARCHAR ( 50 ) CHECK(name !='') NOT NULL,
	permissions TEXT[] CHECK(permissions <@ ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']) NOT NULL
);

INSERT INTO Groups (name, permissions) VALUES ('test1', ARRAY['READ','DELETE', 'WRITE']);
INSERT INTO Groups (name, permissions) VALUES ('test2', ARRAY['READ', 'UPLOAD_FILES']);
INSERT INTO Groups (name, permissions) VALUES ('test3', ARRAY['READ', 'WRITE', 'DELETE', 'UPLOAD_FILES']);
INSERT INTO Groups (name, permissions) VALUES ('test4', ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']);

CREATE TABLE UserGroup (
  user_id int NOT NULL,
  group_id int NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (group_id) REFERENCES Groups(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO UserGroup (user_id, group_id) VALUES (1, 1);
INSERT INTO UserGroup (user_id, group_id) VALUES (2, 2);
INSERT INTO UserGroup (user_id, group_id) VALUES (3, 3);