import { styled } from "react-tailwind-variants"

export const TableContainer = styled("div", {
  base: "table w-full"
})

export const TableRow = styled("div", {
  base: "table-row"
})

export const TableCell = styled("div", {
  base: "table-cell h-8 align-middle h-6 px-2 first:pl-0 last:pr-0 last:w-full relative last:border-l-2 last:border-outline-dimmest"
})

export const TableCellContent = styled("div", {
  base: "flex flex-col h-8 px-2 justify-center"
})
