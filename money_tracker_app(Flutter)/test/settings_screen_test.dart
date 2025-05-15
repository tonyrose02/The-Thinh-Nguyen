import 'package:flutter_test/flutter_test.dart';
import 'package:money_tracker_app/screens/settings_screen.dart';
import 'package:flutter/material.dart';

void main() {
  testWidgets('Settings screen displays all required elements', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: SettingsScreen()));

    // Verify the notification toggle is present
    expect(find.text('Enable Notifications'), findsOneWidget);

    // Verify the language switcher is present
    expect(find.text('Change Language'), findsOneWidget);

    // Verify the sign-out button is displayed
    expect(find.text('Sign Out'), findsOneWidget);
  });
}
