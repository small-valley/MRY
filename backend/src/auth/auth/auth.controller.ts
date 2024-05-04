import { Body, Controller, Get, Post, Req, Request, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { Public } from "./decorator/public.decorator";
import { SigninDto, SignupDto } from "./dto/auth.dto";
import { AuthExceptionFilter } from "./filter/auth.filter";
import { GoogleAuthGuard } from "./guard/google-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SigninDto })
  @Post("signin")
  async signin(@Request() req) {
    // request.user is set by LocalStrategy called from LocalAuthGuard
    // HACK: Redirect response causes cors error in frontend
    //await this.redirectWithCookie(req, res);
    return {
      data: {
        accessToken: await this.authService.signin(req.user.userId, req.user.email, req.user.role),
      },
      hasError: false,
      statusCode: 201,
      message: "",
    };
  }

  @Public()
  @ApiBody({ type: SignupDto })
  @Post("signup")
  async signup(@Body() request: SignupDto) {
    const newUser = await this.authService.signup(request);
    return {
      data: {
        accessToken: await this.authService.signin(newUser.userId, newUser.email, newUser.role),
      },
      hasError: false,
      statusCode: 201,
      message: "",
    };
  }

  @ApiBearerAuth("JWT")
  @Post("logout")
  async logout(@Req() req, @Res() res: Response) {
    await this.authService.logout(req.userId);
    // HACK: to delete cookie, set expores as past date, but it doesn't work -> delete it in frontend
    // res.cookie("access_token", "", {
    //   expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    //   domain: "localhost",
    //   path: "/",
    // });
    res.status(201).json({
      data: null,
      hasError: false,
      statusCode: 201,
      message: "",
    });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @UseFilters(new AuthExceptionFilter())
  @Get("google")
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @UseFilters(new AuthExceptionFilter())
  @Get("google/callback")
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Handle the callback from Google OAuth
    // HACK: Exchange the code for an access token of google
    await this.redirectWithCookie(req, res);
  }

  async redirectWithCookie(req: any, res: Response) {
    // Return the access token to the frontend as cookie
    res.cookie("access_token", await this.authService.signin(req.user.userId, req.user.email, req.user.role), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
      domain: "localhost",
      path: "/",
      httpOnly: false, // enable frontend to read the cookie
      secure: false, // enable frontend to access the cookie when developing locally
      sameSite: "lax", // enable frontend to send cookie to frontend server
    });
    // Redirect to the home page
    res.redirect(`${process.env.FRONT_AUTH_REDIRECT_URL}/home`);
  }
}
