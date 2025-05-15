import 'package:flutter/material.dart';
import 'package:money_tracker_app/main.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';
import '../services/notification_service.dart';
import '../localization/app_localizations.dart';
import 'login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _notificationsEnabled = prefs.getBool('notificationsEnabled') ?? true;
    });
  }

  Future<void> _toggleNotifications(bool value) async {
    setState(() {
      _notificationsEnabled = value;
    });

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notificationsEnabled', value);

    if (value) {
      await NotificationService.enableNotifications();
    } else {
      await NotificationService.disableNotifications();
    }

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(AppLocalizations.of(context)
          .translate(value ? 'notifications enabled' : 'notifications disabled')),
    ));
  }

  void _changeLanguage(String languageCode) {
    MyApp.setLocale(context, Locale(languageCode));

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(AppLocalizations.of(context).translate('language_changed')),
    ));
  }

  Future<void> _signOut() async {
    try {
      final authService = AuthService();
      await authService.signOut();
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(e.toString()),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).translate('settings')),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SwitchListTile(
              title: Text(AppLocalizations.of(context).translate('Enable notifications')),
              value: _notificationsEnabled,
              onChanged: _toggleNotifications,
            ),
            ListTile(
              title: Text(AppLocalizations.of(context).translate('Change language')),
              subtitle: const Text('English / Vietnamese'),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: Text(AppLocalizations.of(context).translate('Select language')),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ListTile(
                          title: const Text('English'),
                          onTap: () {
                            _changeLanguage('en');
                            Navigator.pop(context);
                          },
                        ),
                        ListTile(
                          title: const Text('Tiếng Việt'),
                          onTap: () {
                            _changeLanguage('vi');
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const Spacer(),
            Center(
              child: ElevatedButton(
                onPressed: _signOut,
                child: Text(AppLocalizations.of(context).translate('Sign Out!')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
