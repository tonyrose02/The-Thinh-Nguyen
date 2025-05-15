import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/transaction_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Retrieves the current user's ID, throws an exception if not authenticated
  String get _userId {
    final userId = _auth.currentUser?.uid;
    if (userId == null) {
      throw Exception("User is not authenticated");
    }
    return userId;
  }

 Stream<List<TransactionModel>> getTransactions() {
  return _db
      .collection('users')
      .doc(_userId)
      .collection('transactions')
      .orderBy('date', descending: true)
      .snapshots()
      .map((snapshot) => snapshot.docs.map((doc) {
            return TransactionModel.fromMap(doc.data(), doc.id); 
          }).toList());
}

Future<List<TransactionModel>> getAllTransactions() async {
  final querySnapshot = await _db
      .collection('users')
      .doc(_userId)
      .collection('transactions')
      .orderBy('date', descending: true)
      .get();

  return querySnapshot.docs.map((doc) {
    return TransactionModel.fromMap(doc.data(), doc.id); 
  }).toList();
}

  /// Adds a new transaction to Firestore
  Future<void> addTransaction(TransactionModel transaction) async {
    await _db
        .collection('users')
        .doc(_userId)
        .collection('transactions')
        .add(transaction.toMap());
  }

  /// Updates an existing transaction in Firestore
  Future<void> updateTransaction(String transactionId, TransactionModel transaction) async {
    await _db
        .collection('users')
        .doc(_userId)
        .collection('transactions')
        .doc(transactionId)
        .update(transaction.toMap());
  }

  /// Deletes a transaction from Firestore
  Future<void> deleteTransaction(String transactionId) async {
    await _db
        .collection('users')
        .doc(_userId)
        .collection('transactions')
        .doc(transactionId)
        .delete();
  }
}
