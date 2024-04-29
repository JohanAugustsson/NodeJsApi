# NodeJsApi


Hi,
Thank you for review my code. It took a loot more time than I expected to implement DDD with dependency injection in Node.js
I could go for Mongoose and just plain controllers but what is the fun in that :) 
For dependency injection I chose the package Tsyring from Microsoft. 
I wanted to add annotation on controllers, so I picked routing-controllers package. 



## Start application
Clone the repository then run
```docker-compose up --build```

To stop:
```docker-compose down```

Then open swagger ui: ```http://localhost:3000/api-docs```


### Spent time

Thursday:
 - 8h
 - Setting up environment. Had some issues with docker compose and mongodb.
   Currently using an old version of mongo:4.4.17-focal.
 - init of DDD implementation. How to solve it in Node.js
 
Friday: 
 - 8h
 - Add dependency injection
 - Continue to implement DDD

Saturday:
- 4h 
- Add controller annotation
- Add by name search 
- Add suggested pokemon

Sunday
- 3h
- Added Swagger
- Added api endpoints

Monday
- 4h
- Refactor to use Dto instead
- Added api endpoints
- Test api:s
- Refactor compose file to build app and run mongo db


### Future 
What to implement if i had more time

 - Logs, handle logs better
 - Add tests
 - Add version on api, maybe just v1 in path
 - Pokemon create: When create a new pokemon that has evolution we also need to update them to include the new one in there evolutions.
 


