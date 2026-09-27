package com.expense.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.app.MonthlyServiceIfc.MonthlyServiceIfc;
import com.expense.app.model.ItemModel;
import com.expense.app.service.AuthService;

@RestController
@RequestMapping("/expense")
public class MonthlyServiceController {

@Autowired
MonthlyServiceIfc ifc;

@Autowired
AuthService authService;

@PostMapping("/save")
public ResponseEntity<?> saveModel(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
@RequestBody ItemModel model) {
String userEmail = authService.emailForSession(sessionId);
if (userEmail == null) {
return ResponseEntity.status(401).build();
}
return ResponseEntity.ok(ifc.saveItem(model, userEmail));
}

@GetMapping
public ResponseEntity<?> getItemsByYear(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
@RequestParam int year) {
String userEmail = authService.emailForSession(sessionId);
if (userEmail == null) {
return ResponseEntity.status(401).build();
}
return ResponseEntity.ok(ifc.getItemsByYear(year, userEmail));
}

@GetMapping("/month")
public ResponseEntity<?> getItemsByMonth(@RequestHeader(value = "X-Session-Id", required = false) String sessionId,
@RequestParam int month) {
String userEmail = authService.emailForSession(sessionId);
if (userEmail == null) {
return ResponseEntity.status(401).build();
}
return ResponseEntity.ok(ifc.getItemsByMonth(month, userEmail));
}

}
