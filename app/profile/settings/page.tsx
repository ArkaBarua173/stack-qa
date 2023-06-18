import SettingsContent from "@/app/components/SettingsContent";

export default async function Settings() {
  return (
    <div className="p-8">
      <h1 className="font-medium text-2xl">Settings</h1>
      <SettingsContent />
    </div>
  );
}
