import { tags } from "@core/index"

export const findTag = (tagId: number) => {
    const tag: any = tags.filter(tag => tag.id === tagId)
    return tag[0]
}