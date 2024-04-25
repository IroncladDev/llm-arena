import fs from "fs"
import Handlebars from "handlebars"
import juice from "juice"
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

type BaseEmailArgs = {
  title: string
  paragraphs: string[]
  buttonLinks: { text: string; href: string }[]
}

export const baseEmail = (args: BaseEmailArgs) =>
  juice(
    Handlebars.compile<BaseEmailArgs>(
      fs.readFileSync("emails/base.html", "utf8"),
    )(args),
  )
