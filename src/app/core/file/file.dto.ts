interface CreateFileDto {
  file: File;
  userId: number;
}

interface CreateFilesDto {
  files: FileList;
  userId: number;
}

export { CreateFileDto, CreateFilesDto };
