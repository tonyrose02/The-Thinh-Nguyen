import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:money_tracker_app/screens/home_screen.dart';
import 'package:money_tracker_app/screens/transaction_management_screen.dart';
import 'package:money_tracker_app/screens/settings_screen.dart';

void main() {
  group('HomeScreen Tests', () {
    testWidgets('renders HomeScreen with navigation bar', (WidgetTester tester) async {
      // Render the HomeScreen
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );

      // Verify the bottom navigation bar and items are present
      expect(find.byType(BottomNavigationBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Transactions'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('navigates to Transaction Management Screen', (WidgetTester tester) async {
      // Render the HomeScreen
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );

      // Tap on the Transactions navigation item
      await tester.tap(find.text('Transactions'));
      await tester.pumpAndSettle();

      // Verify Transaction Management Screen is displayed
      expect(find.byType(TransactionManagementScreen), findsOneWidget);
    });

    testWidgets('navigates to Settings Screen', (WidgetTester tester) async {
      // Render the HomeScreen
      await tester.pumpWidget(
        const MaterialApp(
          home: HomeScreen(),
        ),
      );

      // Tap on the Settings navigation item
      await tester.tap(find.text('Settings'));
      await tester.pumpAndSettle();

      // Verify Settings Screen is displayed
      expect(find.byType(SettingsScreen), findsOneWidget);
    });
  });
}
