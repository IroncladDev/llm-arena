import sendgrid from "@sendgrid/mail"
import fs from "fs"
import Handlebars from "handlebars"
import juice from "juice"

const { SENDGRID_API_KEY } = process.env

if (!SENDGRID_API_KEY) throw new Error("Missing SENDGRID_API_KEY")

sendgrid.setApiKey(SENDGRID_API_KEY)

type SendReturn = Promise<
  | {
      success: true
    }
  | {
      success: false
      message: string
    }
>

export async function send(args: sendgrid.MailDataRequired): SendReturn {
  return await sendgrid
    .send(args)
    .then(() => ({ success: true as true }))
    .catch((e: Error) => {
      console.log(e)

      return { success: false, message: e.message }
    })
}

type BaseEmailArgs = {
  title: string
  paragraphs: string[]
  buttonLinks: { text: string; href: string }[]
}

export const baseEmail = (args: BaseEmailArgs) =>
  juice(
    Handlebars.compile<BaseEmailArgs>(
      fs.readFileSync("emails/base.html", "utf8")
    )(args)
  )

// console.log(
//   await send({
//     from: "noreply@ai-to.ai",
//     replyTo: "conner@connerow.dev",
//     to: "connerow1115@gmail.com",
//     subject: "Testing",
//     text: `This is a test`,
//     html: baseEmail({
//       title: "Test",
//       paragraphs: ["this is a test one", "this is a test two"],
//       buttonLinks: [
//         {
//           text: "Test",
//           href: "https://ai-to.ai"
//         }
//       ]
//     })
//   })
// )
