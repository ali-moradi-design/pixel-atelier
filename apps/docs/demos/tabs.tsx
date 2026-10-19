import { Tab, TabList, TabPanel, Tabs } from "pixel-atelier/tabs";

export default function Demo() {
  return (
    <div className="grid w-full max-w-md gap-8">
      <Tabs defaultValue="preview">
        <TabList aria-label="Example">
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
          <Tab value="props">Props</Tab>
        </TabList>
        <TabPanel value="preview" className="text-sm text-pa-muted">
          The preview.
        </TabPanel>
        <TabPanel value="code" className="font-pa-mono text-xs">
          {"<Button />"}
        </TabPanel>
        <TabPanel value="props" className="text-sm">
          The props table.
        </TabPanel>
      </Tabs>
      <Tabs defaultValue="dark" variant="segmented">
        <TabList aria-label="Theme">
          <Tab value="dark">Dark</Tab>
          <Tab value="light">Light</Tab>
          <Tab value="system">System</Tab>
        </TabList>
      </Tabs>
    </div>
  );
}
