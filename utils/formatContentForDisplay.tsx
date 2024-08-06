import parse, { DOMNode, domToReact } from "html-react-parser"
import Link from "next/link"

export const formatContentForDisplay = (content: string) => {
	const htmlString = content
	.replace(/\n/g, "<br />")
	.replace(/#(\w+)/g, "<a href='/tag/$1' class='hashtag'>#$1</a>")
	.replace(/@(\w+)/g, "<a href='/$1' class='handle'>@$1</a>")

	const options = {
	replace: (domNode: DOMNode, index: number) => {
		if (domNode.type === "tag" && domNode.name === "a") {
		const { attribs, children } = domNode
		return (
			<Link href={attribs.href} passHref key={index} className={attribs.class}>
			{domToReact(children as DOMNode[])}
			</Link>
		)
		}
	},
	}

	return parse(htmlString, options)
}
