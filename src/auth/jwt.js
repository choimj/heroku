import JwtStrategy from "passport-jwt";
import ExtractJwt from "passport-jwt";
import { prisma } from "../../generated/prisma-client";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const opts = {
  jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(), //BearerToken 방식으로
  secretOrKey: process.env.JWT_SECRET
};

export default new JwtStrategy.Strategy(opts, async (jwt_payload, done) => {
  const { email } = jwt_payload;

  return done(null, { flag: true, user: { email: email } });
});
