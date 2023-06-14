import {Catch, ExceptionFilterMethods, PlatformContext, Req} from "@tsed/common";
import {Inject} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {OnVerify, PassportException, Protocol} from "@tsed/passport";
import {IStrategyOptions, Strategy} from "passport-local";
import {UserModel} from "../model/db/User.model";
import {UsersService} from "../services/UserService";
import {StatusCodes} from "http-status-codes";
import {NotAuthorized} from "../exceptions/NotAuthorized";

@Protocol<IStrategyOptions>({
    name: "login",
    useStrategy: Strategy,
    settings: {
        session: true,
        usernameField: "email",
        passwordField: "password",
    }
})
export class LoginLocalProtocol implements OnVerify {

    @Inject()
    private usersService: UsersService;

    public async $onVerify(@Req() request: Req, @BodyParams() credentials: UserModel): Promise<UserModel | null> {
        const {email, password} = credentials;
        const user = await this.usersService.getUser(email, password);
        if (!user) {
            throw new NotAuthorized("Wrong credentials.", StatusCodes.UNAUTHORIZED);
        }
        return user;
    }
}

@Catch(PassportException)
export class PassportExceptionFilter implements ExceptionFilterMethods {
    public catch(exception: PassportException, ctx: PlatformContext): unknown {
        const {response} = ctx;
        return response.status(StatusCodes.UNAUTHORIZED).body("Unauthorised");
    }
}
