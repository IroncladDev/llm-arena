import { SearchInput } from "@/app/api/search/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Text from "@/components/ui/text"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { InfoIcon, SlidersHorizontal } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { styled } from "react-tailwind-variants"

export default function LLMSearchFilter({
  search,
  setSearch,
  searchBy,
  setSearchBy
}: {
  search: Omit<SearchInput, "searchBy" | "limit">
  setSearch: Dispatch<SetStateAction<Omit<SearchInput, "searchBy" | "limit">>>
  searchBy: SearchInput["searchBy"]
  setSearchBy: Dispatch<SetStateAction<SearchInput["searchBy"]>>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 min-w-48">
        <FilterGroup>
          <Text weight="medium">Search By</Text>
          <FilterField>
            <Checkbox
              id="name"
              checked={searchBy.name}
              onCheckedChange={checked =>
                setSearchBy({ ...searchBy, name: Boolean(checked) })
              }
            />
            <Text asChild color="dimmer">
              <label htmlFor="name">Name</label>
            </Text>
          </FilterField>
          <FilterField>
            <Checkbox
              id="description"
              checked={searchBy.sourceDescription}
              onCheckedChange={checked =>
                setSearchBy({
                  ...searchBy,
                  sourceDescription: Boolean(checked)
                })
              }
            />
            <Text asChild color="dimmer">
              <label htmlFor="description">Description</label>
            </Text>
          </FilterField>
          <FilterField>
            <Checkbox
              id="fields"
              checked={searchBy.fields}
              onCheckedChange={checked =>
                setSearchBy({ ...searchBy, fields: Boolean(checked) })
              }
            />
            <Text asChild color="dimmer">
              <label htmlFor="fields">Fields</label>
            </Text>
          </FilterField>
        </FilterGroup>
        <FilterGroup>
          <FilterField className="pl-0">
            <Text weight="medium">Advanced Search</Text>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 text-foreground-dimmer" />
              </TooltipTrigger>
              <TooltipContent className="bg-highest max-w-64">
                <Text multiline>
                  Allows postgres full-text search operators such as{" "}
                  <code>|</code> and <code>&</code>. See{" "}
                  <a
                    href="https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#postgresql"
                    target="_blank"
                  >
                    examples
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.postgresql.org/docs/12/functions-textsearch.html"
                    target="_blank"
                  >
                    Documentation
                  </a>
                </Text>
              </TooltipContent>
            </Tooltip>
          </FilterField>
          <FilterField>
            <Checkbox
              id="advanced"
              checked={search.advanced}
              onCheckedChange={checked =>
                setSearch({ ...search, advanced: Boolean(checked) })
              }
            />
            <Text asChild color="dimmer">
              <label htmlFor="advanced">enabled</label>
            </Text>
          </FilterField>
        </FilterGroup>
        <FilterGroup>
          <Text weight="medium">LLM Status</Text>
          <RadioGroup
            value={search.status}
            onValueChange={value =>
              setSearch({
                ...search,
                status: value as SearchInput["status"]
              })
            }
          >
            <FilterField>
              <RadioGroupItem value="all" id="status-all" />
              <Text asChild color="dimmer">
                <label htmlFor="status-all">All</label>
              </Text>
            </FilterField>
            <FilterField>
              <RadioGroupItem value="pending" id="status-pending" />
              <Text asChild color="dimmer">
                <label htmlFor="status-pending">Pending</label>
              </Text>
            </FilterField>
            <FilterField>
              <RadioGroupItem value="approved" id="status-approved" />
              <Text asChild color="dimmer">
                <label htmlFor="status-approved">Approved</label>
              </Text>
            </FilterField>
            <FilterField>
              <RadioGroupItem value="rejected" id="status-rejected" />
              <Text asChild color="dimmer">
                <label htmlFor="status-rejected">Rejected</label>
              </Text>
            </FilterField>
          </RadioGroup>
        </FilterGroup>
      </PopoverContent>
    </Popover>
  )
}

const FilterGroup = styled("div", {
  base: "flex flex-col gap-1"
})

const FilterField = styled("div", {
  base: "flex items-center gap-2 pl-2"
})
