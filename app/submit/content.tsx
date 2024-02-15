"use client";

import { MotionContainer } from "@/components/container";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import gr from "@/lib/gradients";
import { colors, tokens } from "@/tailwind.config";
import { MetaProperty, MetaPropertyType } from "@prisma/client";
import { useEffect, useState } from "react";
import { MetaFieldRow } from "./components/MetaField";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { submit } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { styled } from "react-tailwind-variants";

export type MetaField = {
  property?: MetaProperty | null;
  type: MetaPropertyType;
  name: string;
  value: number | string | boolean;
};

export default function Content({
  commonMeta,
}: {
  commonMeta: MetaProperty[];
}) {
  const router = useRouter();
  const [state, formAction] = useFormState(submit, null);
  const [metadata, setMetadata] = useState<Array<MetaField>>(
    commonMeta.map((m) => ({
      property: m,
      type: m.type,
      name: m.name,
      value:
        m.type === MetaPropertyType.String
          ? ""
          : m.type === MetaPropertyType.Boolean
            ? true
            : 0,
    })),
  );

  const appendNewField = () => {
    setMetadata((md) => [
      ...md,
      {
        name: "",
        type: MetaPropertyType.Number,
        value: "",
        property: null,
      },
    ]);
  };

  useEffect(() => {
    if (state && state.success && state.data) {
      router.push("/llms?llm=" + state.data.llm.id);
    }
  }, [state, router]);

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="items-center absolute h-screen overflow-y-auto"
      style={{
        background: gr.merge(
          gr.radial(
            `circle at 50% 100%`,
            tokens.colors.red[600] + "aa",
            tokens.colors.red[600] + "65 20%",
            "transparent 70%",
            "transparent",
          ),
          gr.linear(75, colors.root, "#292524"),
        ),
      }}
    >
      <FormContainer>
        <FormContent action={formAction}>
          <Text size="h2" weight="bold" className="text-center">
            Submit an LLM
          </Text>
          <FormFields>
            <FormField>
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                placeholder="Unhinged Chat 6b"
                required
                variant="elevated"
              />
            </FormField>
            <FormField>
              <Label>Metadata</Label>
              <LabelDescription>
                Comparable attributes for each LLM on this website such as
                benchmark performance, parameter count, context length, etc. -
                all of which can be verified in the Source Description below.{" "}
                <strong className="text-foreground-dimmer">snake_case</strong>{" "}
                is enforced.
              </LabelDescription>
              {metadata.length > 0 ? (
                <>
                  <MetaHeaders>
                    <Text
                      weight="medium"
                      color="dimmest"
                      className="grow shrink-0 basis-0 pl-2"
                    >
                      Key
                    </Text>
                    <Text
                      weight="medium"
                      color="dimmest"
                      className="grow shrink-0 basis-0 pl-2"
                    >
                      Type
                    </Text>
                    <Text
                      weight="medium"
                      color="dimmest"
                      className="grow shrink-0 basis-0 pl-2"
                    >
                      Value
                    </Text>
                  </MetaHeaders>
                  <MetaPropertyContainer>
                    {metadata.map((field, i) => (
                      <MetaFieldRow
                        key={i}
                        field={field}
                        metadata={metadata}
                        onChange={(args: Partial<MetaField>) => {
                          setMetadata((newMetadata) => {
                            return newMetadata.map((m, j) =>
                              j === i ? { ...m, ...args } : m,
                            );
                          });
                        }}
                        onDelete={() => {
                          setMetadata((newMetadata) => {
                            return newMetadata.filter((_, j) => j !== i);
                          });
                        }}
                      />
                    ))}
                  </MetaPropertyContainer>
                  <Button
                    className="w-auto self-center mt-2"
                    type="button"
                    onClick={appendNewField}
                  >
                    <PlusIcon size={16} />
                    <Text>New Property</Text>
                  </Button>
                </>
              ) : (
                <EmptyMetaContainer>
                  <Text size="lg" color="dimmer">
                    No metadata yet
                  </Text>
                  <Button
                    className="w-auto self-center"
                    type="button"
                    onClick={appendNewField}
                  >
                    <PlusIcon size={16} />
                    <Text>New Property</Text>
                  </Button>
                </EmptyMetaContainer>
              )}
              <input
                type="hidden"
                name="metadata"
                value={JSON.stringify(metadata)}
              />
            </FormField>
            <FormField>
              <Label htmlFor="description">Source Description</Label>
              <LabelDescription>
                Add one or more sources to back the metadata properties you
                provided so that reviewers can verify them.
              </LabelDescription>
              <Textarea
                name="description"
                placeholder="context_length and pretraining_tokens can be verified by <source>, ..."
                rows={6}
                className="resize-y"
                variant="elevated"
                required
              />
            </FormField>
          </FormFields>
          <SubmitButton />
          {state && !state.success && state.message && (
            <Text className="text-accent-dimmer" multiline>
              <em>{state.message}</em>
            </Text>
          )}
        </FormContent>
      </FormContainer>
    </MotionContainer>
  );
}

const LabelDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text multiline color="dimmest" className="px-3 mb-2">
      {children}
    </Text>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      variant="elevated"
      disabled={pending}
    >
      Submit
    </Button>
  );
};

const MetaHeaders = styled("div", {
  base: "flex items-center ml-3 w-[calc(100%-70px)]",
});

const MetaPropertyContainer = styled("div", {
  base: "flex flex-col border border-outline-dimmest mx-3",
});

const EmptyMetaContainer = styled("div", {
  base: "flex flex-col p-4 items-center justify-center border-2 border-dashed border-outline-dimmer min-h-[160px] rounded-lg gap-2",
});

const FormContainer = styled("div", {
  base: "w-full flex justify-center py-16 max-sm:py-0",
});

const FormContent = styled("form", {
  base: "w-full max-w-3xl flex flex-col gap-4 py-6 px-4 bg-default border-2 border-outline-dimmest rounded-lg shadow-lg max-sm:border-none",
});

const FormFields = styled("div", { base: "flex flex-col" });

const FormField = styled("div", {
  base: "flex flex-col gap-1 p-2 w-full border-x-2 last:border-b-2 last:rounded-b-lg last:pb-6 first:border-t-2 first:!rounded-t-lg first:pt-6 border-higher focus-within:border-accent-dimmest transition-colors max-sm:px-0 max-sm:border-0 last:max-sm:rounded-b-none first:max-sm:rounded-t-none last:max-sm:border-b-0 first:max-sm:border-t-0",
});

const Label = styled("label", {
  base: "text-lg font-medium text-foreground-dimmer pl-2",
});