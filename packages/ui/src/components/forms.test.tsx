import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "../../test/axe.ts";
import { Checkbox } from "./checkbox.tsx";
import { Combobox } from "./combobox.tsx";
import { Field } from "./field.tsx";
import { Input } from "./input.tsx";
import { Radio, RadioGroup } from "./radio.tsx";
import { Select } from "./select.tsx";
import { Slider } from "./slider.tsx";
import { Switch } from "./switch.tsx";
import { Textarea } from "./textarea.tsx";

const frameworks = [
  { value: "astro", label: "Astro" },
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix", disabled: true },
  { value: "vite", label: "Vite" },
];

describe("Field", () => {
  it("labels the control and links the description", () => {
    render(
      <Field label="Email" description="We never share it.">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks the control invalid and announces the error", () => {
    render(
      <Field label="Website" error="Enter a valid address." required>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Website");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid address.");
    expect(input).toHaveAccessibleDescription("Enter a valid address.");
  });

  it("works with Textarea", () => {
    render(
      <Field label="Message">
        <Textarea autoResize />
      </Field>,
    );
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });
});

describe("Checkbox, Radio, Switch, Slider", () => {
  it("toggles a checkbox and reports it", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Email notifications" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText("Email notifications"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("sets the indeterminate property", () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("selects one radio in a group", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        aria-label="Billing"
        defaultValue="monthly"
        onValueChange={onValueChange}
      >
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText("Monthly")).toBeChecked();
    await userEvent.click(screen.getByLabelText("Yearly"));
    expect(screen.getByLabelText("Yearly")).toBeChecked();
    expect(screen.getByLabelText("Monthly")).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("yearly");
  });

  it("is a switch", async () => {
    render(<Switch label="Reduced motion" />);
    const sw = screen.getByRole("switch", { name: "Reduced motion" });
    await userEvent.click(sw);
    expect(sw).toBeChecked();
  });

  it("reports slider values and exposes the fill", () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="Pixel size"
        min={0}
        max={20}
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole("slider", { name: "Pixel size" });
    expect(slider.style.getPropertyValue("--pb-fill")).toBe("25%");
    fireEvent.change(slider, { target: { value: "10" } });
    expect(onValueChange).toHaveBeenCalledWith(10);
    expect(slider.style.getPropertyValue("--pb-fill")).toBe("50%");
  });
});

describe("Select", () => {
  it("opens with the keyboard, skips disabled options and picks", async () => {
    const onValueChange = vi.fn();
    render(
      <Field label="Framework">
        <Select
          options={frameworks}
          defaultValue="next"
          onValueChange={onValueChange}
          name="fw"
        />
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveTextContent("Next.js");
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("option", { name: "Next.js" })).toHaveAttribute(
      "data-highlighted",
    );
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Vite" })).toHaveAttribute(
      "data-highlighted",
    );
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("vite");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(document.querySelector('input[name="fw"]')).toHaveValue("vite");
  });

  it("jumps by typing and closes on Escape", async () => {
    render(<Select aria-label="Framework" options={frameworks} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Select…");
    await userEvent.click(trigger);
    await userEvent.keyboard("v");
    expect(screen.getByRole("option", { name: "Vite" })).toHaveAttribute(
      "data-highlighted",
    );
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("picks with the mouse", async () => {
    render(<Select aria-label="Framework" options={frameworks} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Astro" }));
    expect(screen.getByRole("combobox")).toHaveTextContent("Astro");
  });
});

describe("Combobox", () => {
  it("filters as you type and picks with Enter", async () => {
    const onValueChange = vi.fn();
    render(
      <Field label="Framework">
        <Combobox options={frameworks} onValueChange={onValueChange} />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Framework" });
    await userEvent.type(input, "it");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Vite"]);
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("vite");
    expect(input).toHaveValue("Vite");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the empty text and clears on Escape", async () => {
    render(
      <Combobox aria-label="Framework" options={frameworks} emptyText="Nothing here" />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "zzz");
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}{Escape}");
    expect(input).toHaveValue("");
  });
});

it("form controls have no axe violations", async () => {
  const { container } = render(
    <form>
      <Field label="Name" description="Shown publicly">
        <Input />
      </Field>
      <Field label="Bio">
        <Textarea />
      </Field>
      <Checkbox label="Subscribe" description="Monthly, no spam" />
      <RadioGroup aria-label="Plan" defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>
      <Switch label="Dark mode" />
      <Slider aria-label="Volume" />
      <Field label="Framework">
        <Select options={frameworks} />
      </Field>
      <Field label="Search">
        <Combobox options={frameworks} />
      </Field>
    </form>,
  );
  await expectNoAxeViolations(container);
});
