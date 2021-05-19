#include <wchar.h>
#define WIN32_LEAN_AND_MEAN
#include <stdio.h>
#include <windows.h>

#define qode "qode.exe"
#define true 1
#define SETCWDTO "SETCWDTO"

STARTUPINFOW si;

#define LEN(s) (sizeof(s) - 1)

int wmain(int argc, wchar_t *argv[]) {
   DWORD name_len = 0;
   wchar_t *name = *argv;
   int last_backslash = -1;

   wchar_t c;
   while ((c = name[name_len])) {
      if (c == L'\\' || c == L'/') {
         last_backslash = name_len;
      }
      name_len++;
   }

   // includes null byte
   size_t qode_len = last_backslash + sizeof(qode);
   for (size_t i = 0; i < sizeof(qode); ++i) {
      // + 1 because we want to write starting after the '/'
      name[last_backslash + 1 + i] = qode[i];
   }

   // name is now `${__dirname}/qode.exe`

   // includes null byte
   DWORD cwd_len = GetCurrentDirectoryW(0, NULL);

   // the memory layout is going to look like `${__dirname}\0${qode} ${cwd}`
   wchar_t *dirname = _alloca(
      sizeof(wchar_t) * (0
         + last_backslash + LEN("\0")
         + qode_len + LEN(" ") + LEN(SETCWDTO) + LEN(" ") + cwd_len
      )
   );

   for (size_t i = 0; i < last_backslash; ++i) {
      dirname[i] = name[i];
   }
   dirname[last_backslash] = '\0';

   wchar_t *qode_arg = dirname + last_backslash + 1;
   for (size_t i = 0; i < qode_len; ++i) {
      qode_arg[i] = name[i];
   }

   wchar_t *cwd_arg = qode_arg + qode_len;
   *cwd_arg++ = ' ';

   for (size_t i = 0; i < LEN(SETCWDTO); ++i) {
      *cwd_arg++ = SETCWDTO[i];
   }

   GetCurrentDirectoryW(cwd_len, cwd_arg);

   wprintf(L"qode: %s\ndirname: %s\nargs: %s\n", name, dirname, qode_arg);

   PROCESS_INFORMATION pi;

   BOOL success = CreateProcessW(
      name,    // lpApplicationName
      qode_arg, // lpCommandLine
      NULL,    // lpProcessAttributes
      NULL,    // lpThreadAttributes
      true,    // bInheritHandles
      0,       // dwCreationFlags
      NULL,    // lpEnvironment
      dirname, // lpCurrentDirectory
      &si,     // lpStartupInfo
      &pi      // lpProcessInformation
   );

   {
      printf("Error: %lu\n", GetLastError());
   }
}
