# files 폴더 — PDF 올리는 곳

자료실(library.html)에 올릴 PDF 파일을 여기에 넣습니다.

## 올리는 순서

1. GitHub에서 이 `files` 폴더를 연다
2. 오른쪽 위 `Add file` → `Upload files` 를 누른다
3. PDF 파일을 끌어다 놓고 `Commit changes` 를 누른다
4. `library.html` 파일을 열어서 아래 목록에 세 줄만 추가한다

```js
var LIBRARY_FILES = [
  {
    file:  "diet-receipt-record.pdf",
    title: "하루 식사 기록지",
    desc:  "먹은 것, 잔 시간, 컨디션을 한 장에 적는 기록지예요.",
    icon:  "📄"
  },
];
```

5. 저장하면 자료실 페이지에 카드가 하나 생깁니다

## 파일 이름 규칙

- 영문 소문자, 숫자, 하이픈(-)만 쓰기
- 띄어쓰기와 한글은 피하기 (주소가 깨져 보일 수 있어요)
- 예: `sikdan-record.pdf`, `blood-sugar-guide.pdf`

## 링크 주소

파일 하나하나에도 직접 주소가 생깁니다.

- 자료실 전체: `<홈페이지 주소>/library.html`
- 파일 하나: `<홈페이지 주소>/files/파일이름.pdf`

자료실 페이지의 `링크 복사` 버튼을 누르면 그 파일의 주소가 바로 복사됩니다.
유튜브 고정댓글이나 블로그에 붙여넣기 좋아요.

## 주의

- GitHub는 파일 하나당 100MB까지 올라갑니다. PDF는 보통 넉넉합니다.
- 여기에 올린 파일은 누구나 볼 수 있습니다. 개인정보가 들어간 파일은 올리지 마세요.
