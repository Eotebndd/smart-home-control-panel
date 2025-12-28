import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 清理测试环境
afterEach(() => {
  cleanup();
});

