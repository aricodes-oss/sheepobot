import { wrapHandlerFunc } from 'utils';
import add from './add';
import alias from './alias';
import remove from './remove';
import permissions from './permissions';
import edit from './edit';
import count from './count';

export default [add, alias, remove, permissions, edit, count].map(wrapHandlerFunc);
