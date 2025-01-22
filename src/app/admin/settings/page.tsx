import SettingsScreen from "@/app/components/screens/SettingsScreen/SettingsScreen";
import { getOrInitSettings } from "@/Server/actions_DB/settingsActions";

export default async function SettingsPage() {
    const settings = null; // await getOrInitSettings();

    if (!settings) return;
    return (
        <div>
            <h1>Settings Page</h1>
            <SettingsScreen settings={settings} />
        </div>
    );
}
