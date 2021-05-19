#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#define qode "qode.exe"
#define true 1
#define SETCWD "SETCWD="
#define LEN(s) (sizeof(s) - 1)

STARTUPINFOW si;

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

   // the memory layout is going to look like `${__dirname}\0SETCWD=${cwd}\0\0`
   wchar_t *dirname = _alloca(
      sizeof(wchar_t) * (0
         + last_backslash + LEN("\0")
         + LEN("SETCWD=") + cwd_len + LEN("\0")
      )
   );

   for (size_t i = 0; i < last_backslash; ++i) {
      dirname[i] = name[i];
   }
   dirname[last_backslash] = '\0';

   wchar_t *env = dirname + last_backslash + 1;
   for (size_t i = 0; i < LEN(SETCWD); ++i) {
      env[i] = SETCWD[i];
   }

   wchar_t *cwd = env + LEN(SETCWD);
   GetCurrentDirectoryW(cwd_len, cwd);
   cwd[cwd_len] = '\0';

   PROCESS_INFORMATION pi;

   CreateProcessW(
      name,                       // lpApplicationName
      NULL,                       // lpCommandLine
      NULL,                       // lpProcessAttributes
      NULL,                       // lpThreadAttributes
      true,                       // bInheritHandles
      CREATE_UNICODE_ENVIRONMENT, // dwCreationFlags
      env,                        // lpEnvironment
      dirname,                    // lpCurrentDirectory
      &si,                        // lpStartupInfo
      &pi                         // lpProcessInformation
   );
}
