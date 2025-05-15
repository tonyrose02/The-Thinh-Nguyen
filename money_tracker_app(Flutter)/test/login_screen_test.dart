import 'package:flutter_test/flutter_test.dart';
import 'package:money_tracker_app/screens/login_screen.dart';
import 'package:flutter/material.dart';

void main() {
  testWidgets('Login screen displays all required elements', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));

    // Verify the logo is displayed
    expect(find.byType(Image), findsOneWidget);

    // Verify the email and password fields are displayed
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);

    // Verify the login button is displayed
    expect(find.text('Login'), findsOneWidget);

    // Verify the "Create an account" button is displayed
    expect(find.text('Create an account'), findsOneWidget);
  });

  testWidgets('Login button triggers validation', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));

    // Tap the login button without entering anything
    await tester.tap(find.text('Login'));
    await tester.pump();

    // Verify error messages are displayed
    expect(find.text('Enter a valid email'), findsOneWidget);
    expect(find.text('Password cannot be empty'), findsOneWidget);
  });
}
