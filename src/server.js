import { GraphQLServer } from "graphql-yoga";
import schema from "./schema";
import GoogleStrategy from "./auth/googleOauth";
import JwtStrategy from "./auth/jwt";
import jwt from "jsonwebtoken";
import passport from "passport";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const logger = require("morgan");

const PORT = process.env.PORT || 5000;
const server = new GraphQLServer({ schema });
const jwtSecret = process.env.JWT_SECRET;

passport.use(JwtStrategy);

server.express.use(bodyParser.urlencoded({ extended: false }));
server.express.use(bodyParser.json());

server.express.use(passport.initialize()); // passport 구동
server.express.use(passport.session()); // 세션 연결

server.express.get("/", function(req, res) {
  res.send("Hello World! >>> heroku >>> ver 0.2");
});

server.express.use(logger("dev"));
server.start({ port: PORT }, () => {
  console.log(`========>> Server running on http://localhost:${PORT}`);
});
