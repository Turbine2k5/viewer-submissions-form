import {Controller, Inject} from "@tsed/di";
import {Post, Returns} from "@tsed/schema";
import {StatusCodes} from "http-status-codes";
import {SuccessModel} from "../../model/rest/SuccessModel";
import {NotFound} from "@tsed/exceptions";
import {PlatformResponse, QueryParams, Res} from "@tsed/common";
import {SubmissionConfirmationService} from "../../services/SubmissionConfirmationService";

@Controller("/submissionConformation")
export class SubmissionConfirmationController {

    @Inject()
    private submissionConfirmationService: SubmissionConfirmationService;

    @Post("/processSubmission")
    @Returns(StatusCodes.OK, SuccessModel)
    @Returns(StatusCodes.NOT_FOUND, NotFound)
    public createRound(@Res() res: PlatformResponse, @QueryParams("uid") uid: string): Promise<unknown> {
        return this.submissionConfirmationService.processConfirmation(uid);
    }

}