import {AbstractModel} from "./AbstractModel";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Description, Example, Name, Required} from "@tsed/schema";
import GZDOOM_ACTIONS from "../constants/GZDoomActions";
import type {SubmissionRoundModel} from "./SubmissionRound.model";

@Entity()
export class SubmissionModel extends AbstractModel {

    @Column({
        nullable: false
    })
    @Name("WAD")
    @Description("the url of the wad")
    @Example("https://www.doomworld.com/idgames/levels/doom2/Ports/megawads/sunlust")
    @Required()
    public wadURL: string;

    @Column({
        nullable: false
    })
    @Name("level")
    @Description("The level of the wad to play")
    @Example("12")
    @Example("E1M3")
    @Required()
    public wadLevel: string;

    @Column({
        nullable: false
    })
    @Name("engine")
    @Description("what game engine to use")
    @Example("Classic Doom")
    @Example("Boom")
    @Example("GZDoom")
    @Required()
    public wadEngine: string;

    @Column({
        type: "simple-array",
        nullable: false,
        default: [GZDOOM_ACTIONS.NONE]
    })
    @Name("gzDoomAction")
    @Description("GZDoom parameters")
    @Example("mouselook, crouch")
    @Example("jump")
    @Example("mouselook")
    @Example("")
    public gzDoomActions: GZDOOM_ACTIONS[];

    @Column({
        nullable: true
    })
    @Name("name")
    @Description("submitter name")
    @Example("Victoria")
    @Example("")
    public submitterName: string;

    @Column({
        default: false
    })
    @Name("author")
    @Description("Did you make this map?")
    @Example("yes")
    @Example("no")
    public submitterAuthor: boolean;

    @Column({
        default: false
    })
    @Name("distribute")
    @Description("If you made this, am i allowed to distribute it to viewers?")
    @Example("yes")
    @Example("no")
    public distributable: boolean;

    @Column({
        nullable: true
    })
    @Name("info")
    @Description("additional info")
    @Example("This wad was made in 4 years")
    @Example("I like cats")
    public info: string;

    @Column({
        nullable: false
    })
    public submissionRoundId: boolean;

    @ManyToOne("SubmissionRoundModel", "submissions", AbstractModel.cascadeOps)
    @JoinColumn({
        name: "submissionRoundId",
        referencedColumnName: "id"
    })
    public submissionRound: SubmissionRoundModel;

}