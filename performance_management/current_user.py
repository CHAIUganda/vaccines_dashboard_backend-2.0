from threading import current_thread

_requests = {}


def get_current_user():
    t = current_thread()
    if t not in _requests:
        return None
    return _requests[t].user


class CurrentUserRequestMiddleware(object):
    def process_request(self, request):
        _requests[current_thread()] = request
