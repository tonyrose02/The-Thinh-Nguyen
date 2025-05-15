import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

class TransactionModel {
  final String id;
  final String label;
  final double amount;
  final String category;
  final String description;
  final DateTime date;
  final bool isPaid;

  TransactionModel({
    required this.id,
    required this.label,
    required this.amount,
    required this.category,
    required this.description,
    required this.date,
    required this.isPaid,
  });

  /// Factory constructor to create a TransactionModel from Firestore data and document ID
  factory TransactionModel.fromMap(Map<String, dynamic> map, String id) {
    return TransactionModel(
       id: id, // Assign the Firestore document ID
      label: map['label'] ?? '',
      amount: (map['amount'] as num).toDouble(), // Ensure numeric type
      category: map['category'] ?? '',
      description: map['description'] ?? '',
      date: (map['date'] as Timestamp).toDate(), // Convert Firestore Timestamp
      isPaid: map['isPaid'] ?? false,
    );
  }

  /// Convert TransactionModel to a Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'label': label,
      'amount': amount,
      'category': category,
      'description': description,
      'date': date,
      'isPaid': isPaid,
    };
  }
  String get formattedDate {
    return DateFormat('yyyy/MM/dd').format(date);
  }
}
