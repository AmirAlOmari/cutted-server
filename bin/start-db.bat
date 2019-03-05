IF not exist "%cd%/../data" md "%cd%/../data"
IF not exist "%cd%/../data/db" md "%cd%/../data/db"
mongod --dbpath="%cd%/../data/db"
