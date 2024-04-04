import { styled } from "react-tailwind-variants"

const Table = {
  Container: styled("div", {
    base: "table w-full"
  }),
  Row: styled("div", {
    base: "table-row"
  }),
  Cell: styled("div", {
    base: "table-cell h-6 align-middle h-6 px-1 first:pl-0 last:pr-0 last:w-full relative last:border-l-2"
  }),
  CellContent: styled("div", {
    base: "flex flex-col h-6 first:pl-0 px-2 justify-center relative"
  })
}

export default Table
