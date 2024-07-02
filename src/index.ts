// Role이라는 enum 정의
enum Role {
  LIBRARIAN, // 사서
  MEMBER, // 멤버
}

// User라는 추상 클래스 정의
// User 클래스는 name, age라는 인자를 받고 getRole이라는 추상 함수를 포함
abstract class User {
  constructor(public name: string, public age: number) {}
  abstract getRole(): Role;
}

// Member라는 클래스 정의
// Member는 User를 상속받음
class Member extends User {
  constructor(name: string, age: number) {
    super(name, age);
  }
  getRole(): Role {
    return Role.MEMBER;
  }
}

// Librarian라는 클래스 정의
// Member와는 Role만 다름
class Librarian extends User {
  constructor(name: string, age: number) {
    super(name, age);
  }
  getRole(): Role {
    return Role.LIBRARIAN;
  }
}

// Book이라는 클래스 정의
// 책은 이름, 저자, 출판일로 구성됨
class Book {
  constructor(public title: string, public author: string, public publishedDate: Date) {}
}

// RentManager라는 인터페이스 정의
// 도서관이 꼭 갖추어야 할 기능을 정의한 명세서
interface RentManager {
  getBooks(): Book[]; // 도서관의 현재 도서 목록을 확인하는 함수
  addBook(user: User, book: Book): void; // 사서가 도서관에 새로운 도서를 입고할 때 호출하는 함수
  removeBook(user: User, book: Book): void; // 사서가 도서관에서 도서를 폐기할 때 호출하는 함수
  rentBook(user: Member, book: Book): void; // 사용자가 책을 빌릴 때 호출하는 함수
  returnBook(user: Member, book: Book): void; // 사용자가 책을 반납할 때 호출하는 함수
}

// RentManager를 구현하는 Library 클래스 생성
class Library implements RentManager {
  // books는 도서관 자체의 책들을 관리하는 변수
  private books: Book[] = [];
  // rentedBooks는 유저의 대여 이력을 관리
  private rentedBooks: Map<string, Book> = new Map<string, Book>();

  // getBooks 함수는 books를 깊은 복사 (외부에서 books 수정하는 것을 방지)
  getBooks(): Book[] {
    // 깊은 복사를 하여 외부에서 books 수정 방지 (깊은 복사 : 복사본을 변경하더라도 원본 객체나 배열에는 영향 주지 X)
    // JSON.parse(), JSON.stringify() 이용하여 this.books 매핑
    return JSON.parse(JSON.stringify(this.books));
  }

  // addBook는 사서만 호출
  addBook(user: User, book: Book): void {
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log("사서만 도서를 추가할 수 있습니다.");
      return;
    }

    this.books.push(book);
  }

  // removeBook는 사서만 호출
  removeBook(user: User, book: Book): void {
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log("사서만 도서를 삭제할 수 있습니다.");
      return;
    }

    const index = this.books.indexOf(book);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }

  // rentBook는 유저만 호출
  rentBook(user: User, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log("유저만 도서를 대여할 수 있습니다.");
      return;
    }

    // rentBook에서는 다른 책을 대여한 유저는 책을 대여할 수 없어야 함
    if (this.rentedBooks.has(user.name)) {
      console.log(`${user.name}님은 이미 다른 책을 대여중이라 빌릴 수 없습니다.`);
    } else {
      this.rentedBooks.set(user.name, book);
      console.log(`${user.name}님이 [${book.title}] 책을 빌렸습니다.`);
    }
  }

  // returnBook에서는 책을 빌린 사람들만 반납할 수 있어야 함
  returnBook(user: User, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log("유저만 도서를 반납할 수 있습니다.");
      return;
    }

    if (this.rentedBooks.get(user.name) === book) {
      this.rentedBooks.delete(user.name);
      console.log(`${user.name}님이 [${book.title}] 책을 반납했어요!`);
    } else {
      console.log(`${user.name}님은 [${book.title}] 책을 빌린적이 없어요!`);
    }
  }
}

// main 함수
function main() {
  const myLibrary = new Library();
  const librarian = new Librarian("르탄이", 30);
  const member1 = new Member("예비개발자", 30);
  const member2 = new Member("독서광", 28);

  const book = new Book("TypeScript 문법 종합반", "강창민", new Date());
  const book2 = new Book("금쪽이 훈육하기", "오은영", new Date());
  const book3 = new Book("요식업은 이렇게!", "백종원", new Date());

  myLibrary.addBook(librarian, book);
  myLibrary.addBook(librarian, book2);
  myLibrary.addBook(librarian, book3);
  const books = myLibrary.getBooks();
  console.log("대여할 수 있는 도서 목록:", books);

  myLibrary.rentBook(member1, book);
  myLibrary.rentBook(member2, book2);

  myLibrary.returnBook(member1, book);
  myLibrary.returnBook(member2, book2);
}

main();

/** 실행 결과 **/
// 대여할 수 있는 도서 목록: [
//   {
//     title: 'TypeScript 문법 종합반',
//     author: '강창민',
//     publishedDate: '2024-07-01T04:03:12.135Z'
//   },
//   {
//     title: '금쪽이 훈육하기',
//     author: '오은영',
//     publishedDate: '2024-07-01T04:03:12.135Z'
//   },
//   {
//     title: '요식업은 이렇게!',
//     author: '백종원',
//     publishedDate: '2024-07-01T04:03:12.135Z'
//   }
// ]
// 예비개발자님이 [TypeScript 문법 종합반] 책을 빌렸습니다.
// 독서광님이 [금쪽이 훈육하기] 책을 빌렸습니다.
// 예비개발자님이 [TypeScript 문법 종합반] 책을 반납했어요!
// 독서광님이 [금쪽이 훈육하기] 책을 반납했어요!
