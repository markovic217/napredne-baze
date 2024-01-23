# napredne-baze

Za pokretanje aplikacije treba da se kreiraju i konfigurišu neo4j i redis baze.

### Neo4j:

Username i password sa http://localhost:7474 stavljate u secrets.json fajlu web servera. Takodje, u Neo4j Browseru treba da se kreira user sa username-om i password-om koji ste ukucali u localhost:7474 pomocu komande:

`CREATE USER <vas_username> SET PASSWORD '<vas_password>'`

Takodje, korisniku treba da se doda admin pristup pomocu komande:

`GRANT ROLE admin to name`

Da biste otvorili secrets.json, pritisnite dugme "Manage user secrets":

![image](https://github.com/markovic217/napredne-baze/assets/76015152/33fb7b54-889e-42b3-a184-767ae7e98f5b)

secrets.json je oblika:
```
{
  "Neo4j:Username": "Vaš username",
  "Neo4j:Password": "Vaš password"
}
```

Dodatno u appsettings.json se treba staviti adresa baze:

```
"ApplicationSettings": {
    "Neo4jConnection": "Adresa neo4j baze", //Primer bolt://localhost:7687
    "RedisConnection": "localhost:6379"
}
```

Ovim je konfigurisanje neo4j baze završeno

### Docker:

Za konfigurisanje Redisa treba skinuti docker.

Ovom komandom se pokreće docker baza na adresi 6379.

`docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`

Nakon toga u appsettings.json se treba staviti adresa baze:

```
"ApplicationSettings": {
    "Neo4jConnection": "Adresa neo4j baze", //Primer bolt://localhost:7687
    "RedisConnection": "localhost:6379"
}
```

### Server:

Server se pokreće jednostavnim klikom na "Run without debugging"

### Web app:

Za pokretanje web aplikacije prvo treba da se pokrene komanda `npm install` a zatim `npm start`


  
